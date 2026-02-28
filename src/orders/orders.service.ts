import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto, findByDateDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class OrdersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles (id, full_name, email), courses ( * )');
    if (error) throw new BadRequestException(error.message);
    return {
      success: true,
      message: 'Lấy toàn bộ danh sách order thành công',
      data: data,
    };
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles (id, full_name, email), courses ( * )')
      .eq('id', id);
    if (error) throw new BadRequestException(error.message);
    return {
      success: true,
      message: `Lấy order bẳng id: ${id} thành công`,
      data: data,
    };
  }

  async findByDate(findByDateDto: findByDateDto) {
    const supabase = this.supabaseService.getClient();
    const dateString = new Date(findByDateDto.date).toISOString().split('T')[0];

    const startOfDay = `${dateString}T00:00:00.000Z`;
    const endOfDay = `${dateString}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles (id, full_name, email), courses ( * )')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay);

    if (error) throw new BadRequestException(error.message);
    return {
      success: true,
      message: `Lấy order bẳng date: ${findByDateDto.date} thành công`,
      data: data,
    };
  }

  async getDailyRevenue(findByDateDto: findByDateDto) {
    const supabase = this.supabaseService.getClient();
    const dateString = new Date(findByDateDto.date).toISOString().split('T')[0];

    const startOfDay = `${dateString}T00:00:00.000Z`;
    const endOfDay = `${dateString}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles (id, full_name, email), courses ( * )')
      .eq('status', 'SUCCESS')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay);

    if (error) throw new BadRequestException(error.message);
    const totalRevenue = data?.reduce(
      (sum, order) => (sum += order.amount),
      0,
    );
    return {
      success: true,
      message: `Tổng doanh thu ngày ${findByDateDto.date} là ${totalRevenue.toLocaleString()} VNĐ`,
      total_orders: data.length,
      total_revenue: totalRevenue,
    };
  }

  async getTotalRevenue() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles (id, full_name, email), courses ( * )')
      .eq('status', 'SUCCESS')


    if (error) throw new BadRequestException(error.message);
    const totalRevenue = data?.reduce(
      (sum, order) => (sum += order.amount),
      0,
    );

    return {
      success: true,
      message: `Tổng doanh thu là ${totalRevenue.toLocaleString()} VNĐ`,
      total_orders: data.length,
      total_revenue: totalRevenue,
    };
  }
}
