import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WaterService } from './water.service';
import {
  UpdateWaterSettingDto,
  CreateWaterLogDto,
  GetLogsDto,
} from './dto/create-water.dto';
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

  @Get('log/:user_id')
  @ApiOperation({
    summary: '[User] Lấy lịch sử uống nước  của User',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getWaterLog(@Param('user_id') user_id: string) {
    return this.waterService.getWaterLogs(user_id);
  }

  @Get('log/daily/:user_id')
  @ApiOperation({
    summary: '[User] Lấy lịch sử uống nước theo ngày của User',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  getDailyWaterLog(@Param('user_id') user_id: string, @Query() date: GetLogsDto) {
    return this.waterService.getDailyWaterLogs(user_id, date);
  }
}
