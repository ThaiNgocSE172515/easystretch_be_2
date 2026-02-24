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
import { CreateMealDto, IdDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('meals')
export class MealsController {
  constructor(private readonly userMealsService: MealsService) { }

  @Post()
  @ApiOperation({ summary: "[User] tạo mới meal phía user" })
  create(@Body() createUserMealDto: CreateMealDto) {
    return this.userMealsService.create(createUserMealDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "[User] cập nhật mới meal phía user" })
  update(@Param("id") id: string, @Body() updateMealDto: UpdateMealDto) {
    return this.userMealsService.update(id, updateMealDto);
  }
  @Delete(":id")
  @ApiOperation({ summary: "[User] Xóa meal phía user" })
  delete(@Param("id") idDto: IdDto) {
    return this.userMealsService.delete(idDto);
  }

  @Post("/many")
  @ApiOperation({ summary: "[User] tạo mới nhiều  meal phía user" })
  @ApiBody({
    type: [CreateMealDto],
    description: 'Mảng các bữa ăn cần tạo mới'
  })
  createMany(@Body() createUserMealDto: CreateMealDto[]) {
    return this.userMealsService.createMany(createUserMealDto);
  }

  @Get()
  @ApiOperation({ summary: "[User] lấy thông tin meal phía user" })
  getMealsByDate(
    @Query('user_id') userId: string,
    @Query('date') date: string, // VD: 2026-02-23
  ) {
    return this.userMealsService.getMealsByDate(userId, date);
  }

}
