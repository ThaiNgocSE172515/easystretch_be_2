import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFoodDto, IdDto } from './dto/create-food.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodsService {
  constructor(private readonly supabaseService: SupabaseService) { }

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
    return { code: 200, success: true, message: 'Thêm món ăn thành công', data };
  }
  async update(id: string, updateFoodDto: UpdateFoodDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('foods').update(updateFoodDto).eq("id", id)
      .select()
      .maybeSingle();

    if (error)
      throw new InternalServerErrorException(
        'Lỗi tạo món ăn: ' + error.message,
      );
    return { code: 200, success: true, message: 'Cập nhật món ăn thành công', data };
  }


  async delete(idDto: IdDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('foods').delete().eq("id", idDto);

    if (error)
      throw new InternalServerErrorException(
        'Xóa nhật thức ăn: ' + error.message,
      );
    return { code: 200, success: true, message: 'Xóa thức ăn thành công' };
  }

  async createMany(createFoodDto: CreateFoodDto[]) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('foods')
      .insert(createFoodDto)
      .select()

    if (error)
      throw new InternalServerErrorException(
        'Lỗi tạo món ăn: ' + error.message,
      );
    return {
      code: 200,
      success: true,
      message: 'Thêm món ăn thành công',
      data
    };
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('foods')
      .select('*');

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 200,
      success: true,
      message: 'tìm món ăn thành công',
      data
    };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('foods')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 200,
      success: true,
      message: 'tìm món ăn thành công',
      data
    };
  }
}
