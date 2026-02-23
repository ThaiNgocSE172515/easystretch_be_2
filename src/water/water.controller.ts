import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WaterService } from './water.service';
import { UpdateWaterSettingDto, CreateWaterLogDto } from './dto/create-water.dto';

@Controller('water')
export class WaterController {
  constructor(private readonly waterService: WaterService) {}

  @Post('settings')
  /* #swagger.tags = ['Water Tracker (Uống Nước)']
     #swagger.summary = 'Cập nhật mục tiêu nước & Sinh ra lịch trình nhắc nhở'
  */
  updateSettings(@Body() dto: UpdateWaterSettingDto) {
    return this.waterService.updateSettings(dto);
  }

  @Post('log')
  /* #swagger.tags = ['Water Tracker (Uống Nước)']
     #swagger.summary = 'Ghi nhận 1 lần uống nước (VD: Vừa uống 250ml)'
  */
  logWater(@Body() dto: CreateWaterLogDto) {
    return this.waterService.logWater(dto);
  }

  @Get('progress/:userId')
  /* #swagger.tags = ['Water Tracker (Uống Nước)']
     #swagger.summary = 'Lấy tiến độ uống nước trong ngày hôm nay của User'
  */
  getDailyProgress(@Param('userId') userId: string) {
    return this.waterService.getDailyProgress(userId);
  }
}
