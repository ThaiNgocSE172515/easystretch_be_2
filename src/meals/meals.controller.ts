import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MealsService } from './meals.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';

@Controller('meals')
export class MealsController {
  constructor(private readonly userMealsService: MealsService) {}

  @Post()
  create(@Body() createUserMealDto: CreateMealDto) {
    return this.userMealsService.create(createUserMealDto);
  }

  @Get()
  /* #swagger.tags = ['User Meals (Nhật ký Dinh dưỡng)']
     #swagger.summary = 'Lấy danh sách các món đã ăn trong 1 ngày, tự động gom nhóm theo bữa'
  */
  getMealsByDate(
    @Query('user_id') userId: string,
    @Query('date') date: string, // VD: 2026-02-23
  ) {
    return this.userMealsService.getMealsByDate(userId, date);
  }
}
