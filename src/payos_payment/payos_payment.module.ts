import { Module } from '@nestjs/common';
import { PayosPaymentService } from './payos_payment.service';
import { PayosPaymentController } from './payos_payment.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
  providers: [PayosPaymentService],
  controllers: [PayosPaymentController],
  imports: [SupabaseModule, CoursesModule]
})
export class PayosPaymentModule { }
