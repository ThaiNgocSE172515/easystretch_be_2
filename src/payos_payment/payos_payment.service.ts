import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayOS } from '@payos/node';
import {
  CreateOrdersDto,
  CreatePaymentLinkDto,
} from './dto/create_payos.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CoursesService } from 'src/courses/courses.service';
import { ApiResponse } from 'src/common/response/api-response';
import { error } from 'console';

@Injectable()
export class PayosPaymentService {
  private payos: PayOS;
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {
    const API_KEY = configService.get<string>('API_KEY');
    const CHECK_SUM_KEY = configService.get<string>('CHECKSUM_KEY');
    const CLIENT_ID = configService.get<string>('CLIENT_ID');
    console.log(API_KEY, CHECK_SUM_KEY, CLIENT_ID);
    this.payos = new PayOS({
      apiKey: API_KEY,
      checksumKey: CHECK_SUM_KEY,
      clientId: CLIENT_ID,
    });
  }

  async createPaymentLink(id: string, createPaymentLink: CreatePaymentLinkDto) {
    const body = {
      orderCode: Number(createPaymentLink.orderCode),
      amount: Number(createPaymentLink.amount),
      description: createPaymentLink.description,
      items:
        createPaymentLink.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
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
          status: paymentLinkResponse.status,
        };
        return order;
      });
      const { data, error } = await this.supabaseService
        .getClient()
        .from('orders')
        .insert(orders)
        .select();
      if (error) {
        throw new BadRequestException(error.message);
      }
      return paymentLinkResponse;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  async webhook(body: any) {
    try {
      const webhookData = this.payos.webhooks.verify(body);
      console.log('Dữ liệu Webhook nhận được:', webhookData);

      const isSuccess = (await webhookData).code === '00';
      const status = isSuccess ? 'SUCCESS' : 'CANCEL';

      const { data: orderData, error: orderError } = await this.supabaseService
        .getClient()
        .from('orders')
        .update({ status: status })
        .eq('sepay_transaction_id', (await webhookData).orderCode)
        .select('*')
        .single();

      if (orderError) {
        console.error('Lỗi cập nhật đơn hàng:', orderError.message);
        return { success: false, message: 'Order not found' };
      }

      console.log(orderData);

      if (isSuccess && orderData) {
        if (orderData.course_id == '49414f0c-ea91-4ded-bd2d-3536c2ea82e5') {
          const { data: profileData, error: errorData } =
            await this.supabaseService
              .getClient()
              .from('profiles')
              .update({ is_subscriber: 'active' })
              .eq('id', orderData.user_id)
              .select();

          if (errorData) throw new BadRequestException(errorData.message);
          return {
            code: 200,
            success: true,
            message: 'Webhook processed successfully vip',
          };
        } else {
          const { data: existingUC } = await this.supabaseService
            .getClient()
            .from('user_courses')
            .select('*')
            .eq('user_id', orderData.user_id)
            .eq('course_id', orderData.course_id)
            .maybeSingle();

          if (!existingUC) {
            const ucData = {
              course_id: orderData.course_id,
              user_id: orderData.user_id,
              enrolled_at: new Date(),
            };

            const { error: userCourseError } = await this.supabaseService
              .getClient()
              .from('user_courses')
              .insert([ucData]);

            if (userCourseError) {
              console.error('Lỗi cấp khóa học:', userCourseError.message);
            }
          }
          return {
            code: 200,
            success: true,
            message: 'Webhook processed successfully',
            orders: orderData,
          };
        }
      }
    } catch (e) {
      console.error('Webhook Error:', e);
      throw new BadRequestException('Invalid Webhook Signature');
    }
  }
}
