import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto, IdDto } from './dto/create-food.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UpdateFoodDto } from './dto/update-food.dto';
import { AuthGuard } from '../guard/auth.guard';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[User] tạo mới food phía user' })
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }


  @Post('/many')
  @ApiOperation({ summary: '[User] tạo mới nhiều food phía user' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: [CreateFoodDto],
  })
  createMany(@Body() createFoodDto: CreateFoodDto[]) {
    return this.foodsService.createMany(createFoodDto);
  }




  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[User] tìm tất cả foods phía user' })
  findAll(@Req() req: any) {
    const id = req.user.id;
    return this.foodsService.findAll(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[User] tìm food the id phía user' })
  findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    const data: IdDto = {
      id: id,
      user_id: user.id,
    };

    return this.foodsService.findOne(data);
  }


  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[User] Xóa foods phía user' })
  delete(@Param('id') id: string, @Req() req) {
    const user = req.user;
    const data: IdDto = {
      id: id,
      user_id: user.id,
    };
    return this.foodsService.delete(data);
  }


  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[User] cập nhật mới food phía user' })
  update(@Param('id') id: string, @Body() updateFoodDto: UpdateFoodDto) {
    return this.foodsService.update(id, updateFoodDto);
  }
}


