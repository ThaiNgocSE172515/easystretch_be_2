import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CoursesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createCourseDto: CreateCourseDto) {
    const supabase = this.supabaseService.getClient();

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert([
        {
          title: createCourseDto.title,
          description: createCourseDto.description,
          level: createCourseDto.level,
        },
      ])
      .select()
      .single();

    if (courseError)
      throw new InternalServerErrorException(
        'Lỗi tạo Course: ' + courseError.message,
      );

    for (const day of createCourseDto.days) {
      const { data: courseDay, error: dayError } = await supabase
        .from('course_days')
        .insert([
          {
            course_id: course.id,
            phase_number: day.phase_number,
            week_number: day.week_number,
            day_number: day.day_number,
            title: day.title,
          },
        ])
        .select()
        .single();

      if (dayError)
        throw new InternalServerErrorException(
          'Lỗi tạo Course Day: ' + dayError.message,
        );

      if (day.exercises && day.exercises.length > 0) {
        const exercisesToInsert = day.exercises.map((ex, index) => ({
          course_day_id: courseDay.id,
          exercise_id: ex.exercise_id,
          order_index: index + 1,
        }));

        const { error: exError } = await supabase
          .from('course_day_exercises')
          .insert(exercisesToInsert);

        if (exError)
          throw new InternalServerErrorException(
            'Lỗi map Exercise vào Day: ' + exError.message,
          );
      }
    }

    return { message: 'Tạo khóa học thành công', course_id: course.id };
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('courses')
      .select('*');

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findOne(id: string) {
    // Sức mạnh của Supabase: Tự động join và lồng JSON các bảng lại với nhau
    const { data, error } = await this.supabaseService
      .getClient()
      .from('courses')
      .select(
        `
        *,
        course_days (
          *,
          course_day_exercises (
            order_index,
            exercises (*)
          )
        )
      `,
      )
      .eq('id', id)
      .maybeSingle();

    if (error) throw new InternalServerErrorException(error.message);
    return {
      data: data,
      success: true,
      code: 200
    };
  }

  getBoughtCourse(userId: string) {
    return this.supabaseService.getClient().from('user_courses').select('*, courses ( * )').eq('user_id', userId);
  }
}
