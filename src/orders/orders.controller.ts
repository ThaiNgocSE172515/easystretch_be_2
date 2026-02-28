import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, findByDateDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { AdminGuard } from '../guard/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    summary: '[Admin] xem toàn bộ danh sách order',
  })
  findAll() {
    return this.ordersService.findAll();
  }
  @Get('/date')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    summary: '[Admin] xem thông tin order theo date',
  })
  findByDate(@Query() date: findByDateDto) {
    return this.ordersService.findByDate(date);
  }

  @Get('/revenue/daily')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    summary: '[Admin] xem thông tin tổng doanh thu theo date',
  })
  findDailyRevenue(@Query() date: findByDateDto) {
    return this.ordersService.getDailyRevenue(date);
  }

  @Get('/revenue')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    summary: '[Admin] xem thông tin doanh thu',
  })
  findTotalRevenue() {
    return this.ordersService.getTotalRevenue();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({
    summary: '[Admin] xem thông tin order theo id',
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
