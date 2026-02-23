import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayOS } from '@payos/node';
import { CreateOrdersDto, CreatePaymentLinkDto, useCourseDto } from './dto/create_payos.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CoursesService } from 'src/courses/courses.service';
import { ApiResponse } from 'src/common/response/api-response';
import { error } from 'console';

@Injectable()
export class PayosPaymentService {
    private payos: PayOS
    constructor(private readonly configService: ConfigService, private readonly supabaseService: SupabaseService) {
        const API_KEY = configService.get<string>("API_KEY");
        const CHECK_SUM_KEY = configService.get<string>("CHECKSUM_KEY");
        const CLIENT_ID = configService.get<string>("CLIENT_ID");
        console.log(API_KEY, CHECK_SUM_KEY, CLIENT_ID)
        this.payos = new PayOS(
            {
                apiKey: API_KEY,
                checksumKey: CHECK_SUM_KEY,
                clientId: CLIENT_ID
            }
        )
    }

    async createPaymentLink(id: string, createPaymentLink: CreatePaymentLinkDto) {
        const body = {
            orderCode: Number(createPaymentLink.orderCode),
            amount: Number(createPaymentLink.amount),
            description: createPaymentLink.description,
            items: createPaymentLink.items.map((i) => ({
                name: i.name,
                quantity: i.quantity,
                price: i.price
            })) || [],
            returnUrl: createPaymentLink.returnUrl,
            cancelUrl: createPaymentLink.cancelUrl,
        };

        try {
            const paymentLinkResponse = await this.payos.paymentRequests.create(body);

            const orders = createPaymentLink!.items!.map((i) => {
                const order: CreateOrdersDto = {
                    user_id: id,
                    amount: paymentLinkResponse.amount,
                    course_id: i.name,
                    created_at: new Date(),
                    sepay_transaction_id: paymentLinkResponse.orderCode,
                    status: paymentLinkResponse.status
                }
                return order;
            })
            const { data, error } = await this.supabaseService.getClient().from("orders").insert(orders).select();
            if (error) {
                throw new BadRequestException(error.message)
            }
            return paymentLinkResponse;
        } catch (error) {
            throw new Error(error);
        }
    }


    async webhook(req: any) {
        const webhookData = this.payos.webhooks.verify(req);
        console.log("đã nhận được web hook " + webhookData);
        if (webhookData) {
            const status = (await webhookData).code == "00" ? "success" : "cancel"
            const { data: orderData, error: orderError } = await this.supabaseService.getClient().from("orders").update({ "status": status }).eq("sepay_transaction_id", (await webhookData).orderCode).select("*").single();

            if (orderError) {
                throw new BadRequestException(orderError.message);
            }

            const ucData: useCourseDto = {
                course_id: orderData.course_id,
                user_id: orderData.user_id,
                enrolled_at: new Date(),
            }

            const { data: userCourseData, error: userCourseError } = await this.supabaseService.getClient().from("user_courses").insert([ucData]).select("*").maybeSingle();
            if (userCourseError) {
                throw new BadRequestException(userCourseError.message);
            }
        }

        return {
            code: 200,
            success: true,
            message: "Webhook received",
        }
    }
}
