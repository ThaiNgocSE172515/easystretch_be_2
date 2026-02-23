import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PayosPaymentService } from './payos_payment.service';
import { CreatePaymentLinkDto } from './dto/create_payos.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('payos-payment')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PayosPaymentController {
    constructor(private readonly payosService: PayosPaymentService) { }
    @Post("create")
    async create(@Body() body: CreatePaymentLinkDto, @Req() req) {
        const orderCode = Number(Date.now().toString().slice(-9));
        const data = {
            ...body,
            orderCode
        }
        const id = req.user.id;
        const res = this.payosService.createPaymentLink(id, data);
        return res
    }

    @Post("webhook")
    webhook(@Body() data: any) {
        return this.payosService.webhook(data)
    }
}

