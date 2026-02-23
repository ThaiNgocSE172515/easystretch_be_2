import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WaterService } from './water.service';
import { UpdateWaterSettingDto, CreateWaterLogDto } from './dto/create-water.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

@Controller('water')
export class WaterController {
  constructor(private readonly waterService: WaterService) {}

  @Post('settings')
  @ApiOperation({
    summary:
      '[User] Cập nhật mục tiêu nước & Sinh ra lịch trình nhắc nhở phía user',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  updateSettings(@Body() dto: UpdateWaterSettingDto) {
    return this.waterService.updateSettings(dto);
  }

  @Post('log')
  @ApiOperation({
    summary: '[User] Ghi nhận 1 lần uống nước (VD: Vừa uống 250ml) phía user',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  logWater(@Body() dto: CreateWaterLogDto) {
    return this.waterService.logWater(dto);
  }

  @Get('progress/:userId')
  @ApiOperation({
    summary: '[User] Lấy tiến độ uống nước trong ngày hôm nay của User',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getDailyProgress(@Param('userId') userId: string) {
    return this.waterService.getDailyProgress(userId);
  }
}
