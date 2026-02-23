import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayOS } from '@payos/node';
import { CreateOrdersDto, CreatePaymentLinkDto } from './dto/create_payos.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CoursesService } from 'src/courses/courses.service';
import { ApiResponse } from 'src/common/response/api-response';

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
        return {
            code: 200,
            success: true,
            message: "Webhook received"
        }
    }
}
