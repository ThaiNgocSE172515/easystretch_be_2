import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FoodsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createFoodDto: CreateFoodDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('foods')
      .insert([createFoodDto])
      .select()
      .single();

    if (error)
      throw new InternalServerErrorException(
        'Lỗi tạo món ăn: ' + error.message,
      );
    return { message: 'Thêm món ăn thành công', data };
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('foods')
      .select('*');

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('foods')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
