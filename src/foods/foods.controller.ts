import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  /* #swagger.tags = ['Foods']
     #swagger.summary = 'Thêm món ăn/thực phẩm mới vào hệ thống'
  */
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }

  @Get()
  /* #swagger.tags = ['Foods']
     #swagger.summary = 'Lấy danh sách tất cả món ăn'
  */
  findAll() {
    return this.foodsService.findAll();
  }

  @Get(':id')
  /* #swagger.tags = ['Foods']
     #swagger.summary = 'Lấy chi tiết thông tin dinh dưỡng của 1 món ăn'
  */
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(id);
  }
}
