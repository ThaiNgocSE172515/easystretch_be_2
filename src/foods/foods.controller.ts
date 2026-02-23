import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { UpdateFoodDto } from './dto/update-food.dto';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) { }

  @Post()
  @ApiOperation({ summary: "[User] tạo mới food phía user" })
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "[User] cập nhật mới food phía user" })
  update(@Param("id") id: string,@Body() updateFoodDto: UpdateFoodDto) {
    return this.foodsService.update(id ,updateFoodDto);
  }

  @Post("/many")
  @ApiOperation({ summary: "[User] tạo mới nhiều food phía user" })
  @ApiBody(
    {
      type: [CreateFoodDto]
    }
  )
  createMany(@Body() createFoodDto: CreateFoodDto[]) {
    return this.foodsService.createMany(createFoodDto);
  }

  @Get()
  @ApiOperation({ summary: "[User] tìm tất cả foods phía user" })
  findAll() {
    return this.foodsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: "[User] tìm food the id phía user" })
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(id);
  }
}
