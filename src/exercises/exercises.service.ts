import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ExercisesService {
  constructor(private readonly supabaseService: SupabaseService) { }

  async create(createExerciseDto: CreateExerciseDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('exercises')
      .insert([createExerciseDto])
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 200,
      success: true,
      message: "Tạo dữ liệu thành công",
      data: data[0]
    };
  }

  async update(id, updateExerciseDto: UpdateExerciseDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('exercises')
      .update(updateExerciseDto).eq("id", id)
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 200,
      success: true,
      message: "Cập nhật dữ liệu thành công",
      data: data[0]
    };
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.from('exercises').select('*');

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 200,
      success: true,
      message: "Lấy dữ liệu thành công",
      data
    };;
  }

  async findOne(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 200,
      success: true,
      message: "Lấy dữ liệu thành công",
      data
    };
  }

  async delete(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 200,
      success: true,
      message: "Xóa exercise thành công",
    };
  }
}
