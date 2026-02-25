import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFoodDto, IdDto, UserIdDto } from './dto/create-food.dto';
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
      .from('foods').delete().eq("id", idDto.id).eq("user_id", idDto.user_id).select();

    if (error)
      throw new InternalServerErrorException(
        'Xóa nhật thức ăn: ' + error.message,
      );
    if (!data || data.length === 0) {
      throw new NotFoundException('Không tìm thấy thức ăn để xóa');
    }

    return { code: 200, success: true, message: 'Xóa thức ăn thành công', data };
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


  async findAll(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('foods')
      .select('*').eq("user_id", id);

    if (error) throw new InternalServerErrorException(error.message);

    return {
      code: 200,
      success: true,
      message: 'tìm món ăn thành công',
      id: id,
      data,
    };
  }

  async findOne(idDto: IdDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('foods')
      .select('*')
      .eq('id', idDto.id).eq("user_id", idDto.user_id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 200,
      success: true,
      message: 'tìm món ăn thành công',
      data
    };
  }
}
