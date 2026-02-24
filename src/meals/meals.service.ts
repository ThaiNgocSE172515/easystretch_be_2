import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMealDto, IdDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MealsService {
  constructor(private readonly supabaseService: SupabaseService) { }

  async create(createUserMealDto: CreateMealDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_meals')
      .insert([
        {
          user_id: createUserMealDto.user_id,
          food_id: createUserMealDto.food_id,
          meal_type: createUserMealDto.meal_type,
          quantity: createUserMealDto.quantity || 1,
          consumed_at: createUserMealDto.consumed_at,
        },
      ])
      .select()
      .single();

    if (error)
      throw new InternalServerErrorException(
        'Lỗi thêm bữa ăn: ' + error.message,
      );
    return { message: 'Thêm vào nhật ký thành công', data };
  }

  async update(id: string, updateMealDto: UpdateMealDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_meals').update(updateMealDto).eq("id", id)
      .select()
      .maybeSingle();

    if (error)
      throw new InternalServerErrorException(
        'Lỗi cập nhật bữa ăn: ' + error.message,
      );
    return { code: 200, success: true, message: 'Cập nhật bữa ăn thành công', data };
  }

  async delete(idDto: IdDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_meals').delete().eq("id", idDto);

    if (error)
      throw new InternalServerErrorException(
        'Xóa nhật bữa ăn: ' + error.message,
      );
    return { code: 200, success: true, message: 'Xóa bữa ăn thành công' };
  }

  async createMany(createUserMealDto: CreateMealDto[]) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_meals')
      .insert(createUserMealDto)
      .select()

    if (error)
      throw new InternalServerErrorException(
        'Lỗi thêm bữa ăn: ' + error.message,
      );
    return { code: 200, success: true, message: 'Thêm vào nhật ký thành công', data };
  }

  async getMealsByDate(userId: string, date: string) {
    // Join với bảng foods để lấy thông tin calo, tên món, hình ảnh
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user_meals')
      .select(
        `
        id,
        meal_type,
        quantity,
        consumed_at,
        foods (id, name, calories, image_url)
      `,
      )
      .eq('user_id', userId)
      .eq('consumed_at', date)
      .order('created_at', { ascending: true });

    if (error) throw new InternalServerErrorException(error.message);

    const groupedMeals = {
      total_calories_of_day: 0,
      BREAKFAST: [],
      LUNCH: [],
      DINNER: [],
      SNACK: [],
    };

    data.forEach((record) => {
      const mealType = record.meal_type;
      const foodInfo = record.foods as any;
      const quantity = record.quantity;

      const calculatedCalories = Math.round(foodInfo.calories * quantity);
      groupedMeals.total_calories_of_day += calculatedCalories;

      if (groupedMeals[mealType]) {
        groupedMeals[mealType].push({
          log_id: record.id,
          food_id: foodInfo.id,
          food_name: foodInfo.name,
          quantity: quantity,
          calories: calculatedCalories,
          image_url: foodInfo.image_url,
        });
      }
    });

    return groupedMeals;
  }
}
