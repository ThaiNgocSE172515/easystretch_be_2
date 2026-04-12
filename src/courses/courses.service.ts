import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly supabaseService: SupabaseService) { }

  async create(createCourseDto: CreateCourseDto) {
    const supabase = this.supabaseService.getClient();
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert([{
        title: createCourseDto.title,
        description: createCourseDto.description,
        type: createCourseDto.type,
        price: createCourseDto.price,
        img_url: createCourseDto.img_url
      }])
      .select()
      .single();

    if (courseError) {
      throw new InternalServerErrorException('Lỗi tạo Course: ' + courseError.message);
    }

    try {
      for (const day of createCourseDto.days) {
        const { data: courseDay, error: dayError } = await supabase
          .from('course_days')
          .insert([{
            course_id: course.id,
            phase_number: day.phase_number,
            week_number: day.week_number,
            day_number: day.day_number,
            title: day.title,
          }])
          .select()
          .single();

        if (dayError) throw new Error('Lỗi tạo Course Day: ' + dayError.message);

        if (day.exercises && day.exercises.length > 0) {
          const exerciseIds = day.exercises.map(ex => ex.exercise_id);

          const { data: existingExercises, error: exerciseError } = await supabase
            .from("exercises")
            .select("id")
            .in("id", exerciseIds);

          if (exerciseError) throw new Error(exerciseError.message);

          const existingIds = new Set(existingExercises.map(e => e.id));

          for (const id of exerciseIds) {
            if (!existingIds.has(id)) {
              throw new NotFoundException("Không tìm thấy exercise với id " + id);
            }
          }

          const exercisesToInsert = day.exercises.map((ex, index) => ({
            course_day_id: courseDay.id,
            exercise_id: ex.exercise_id,
            order_index: index + 1,
          }));

          const { error: exError } = await supabase
            .from('course_day_exercises')
            .insert(exercisesToInsert);

          if (exError) throw new Error('Lỗi map Exercise vào Day: ' + exError.message);
        }
      }

      return { message: 'Tạo khóa học thành công', course_id: course.id };

    } catch (error) {
      await supabase.from('courses').delete().eq('id', course.id);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }



  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('courses')
      .select('*');

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findAllExercise() {
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

    if (error) throw new InternalServerErrorException(error.message);
    return {
      success: true,
      code: 200,
      data: data
    };
  }

  async findOne(id: string) {
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
      success: true,
      code: 200,
      data: data
    };
  }

  getBoughtCourse(userId: string) {
    return this.supabaseService.getClient().from('user_courses').select('*, courses ( * )').eq('user_id', userId);
  }

  async deleteCouse(id: string) {
    const { error } = await this.supabaseService.getClient().from("courses").delete().eq("id", id);
    if (error) {
      throw new NotFoundException("Không tìm thấy course theo id", error.message);
    }

    return {
      message: `xóa course với ${id} thành công`,
      code: 200
    }
  }

  async update(courseId: string, updateCourseDto: UpdateCourseDto) {
    const supabase = this.supabaseService.getClient();

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .update({
        title: updateCourseDto.title,
        description: updateCourseDto.description,
        type: updateCourseDto.type,
        price: updateCourseDto.price,
        img_url: updateCourseDto.img_url
      })
      .eq('id', courseId)
      .select()
      .single();

    if (courseError) {
      throw new InternalServerErrorException('Lỗi cập nhật Course: ' + courseError.message);
    }

    if (updateCourseDto.days) {
      try {
        const { error: deleteDaysError } = await supabase
          .from('course_days')
          .delete()
          .eq('course_id', courseId);

        if (deleteDaysError) {
          throw new Error('Lỗi dọn dẹp ngày học cũ: ' + deleteDaysError.message);
        }

        // Bắt đầu vòng lặp tạo lại cấu trúc ngày và bài tập (Logic y hệt lúc Create)
        for (const day of updateCourseDto.days) {
          const { data: courseDay, error: dayError } = await supabase
            .from('course_days')
            .insert([{
              course_id: courseId,
              phase_number: day.phase_number,
              week_number: day.week_number,
              day_number: day.day_number,
              title: day.title,
            }])
            .select()
            .single();

          if (dayError) throw new Error('Lỗi tạo Course Day: ' + dayError.message);

          if (day.exercises && day.exercises.length > 0) {
            const exerciseIds = day.exercises.map(ex => ex.exercise_id);

            const { data: existingExercises, error: exerciseError } = await supabase
              .from("exercises")
              .select("id")
              .in("id", exerciseIds);

            if (exerciseError) throw new Error(exerciseError.message);

            const existingIds = new Set(existingExercises.map(e => e.id));

            for (const id of exerciseIds) {
              if (!existingIds.has(id)) {
                throw new NotFoundException("Không tìm thấy exercise với id " + id);
              }
            }

            const exercisesToInsert = day.exercises.map((ex, index) => ({
              course_day_id: courseDay.id,
              exercise_id: ex.exercise_id,
              order_index: index + 1,
            }));

            const { error: exError } = await supabase
              .from('course_day_exercises')
              .insert(exercisesToInsert);

            if (exError) throw new Error('Lỗi map Exercise vào Day: ' + exError.message);
          }
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException(error);
      }
    }

    return { message: 'Cập nhật khóa học thành công', course_id: courseId };
  }
}
