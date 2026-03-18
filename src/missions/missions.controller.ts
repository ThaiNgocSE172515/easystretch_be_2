import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { AddMissionExerciseDto } from './dto/add-mission-exercise.dto';
import { CompleteMissionExerciseDto } from './dto/complete-mission-exercise.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';

@ApiTags('missions')
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo nhiệm vụ' })
  create(@Body() createMissionDto: CreateMissionDto) {
    return this.missionsService.create(createMissionDto);
  }

  @Get()
  @ApiQuery({ name: 'date', required: false, description: 'Lọc nhiệm vụ theo ngày (YYYY-MM-DD)' })
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách nhiệm vụ và bài tập' })
  findAll(@Query('date') date?: string) {
    return this.missionsService.findAll(date);
  }

  @Post(':id/add-exercise')
  @ApiOperation({ summary: 'Thêm bài tập vào nhiệm vụ' })
  addExercise(
    @Param('id') id: string,
    @Body() addMissionExerciseDto: AddMissionExerciseDto,
  ) {
    return this.missionsService.addExercise(id, addMissionExerciseDto);
  }

  @Post('complete-exercise')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User hoàn thành bài tập và nhận điểm thưởng' })
  completeExercise(
    @Body() completeMissionExerciseDto: CompleteMissionExerciseDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.missionsService.completeExercise(userId, completeMissionExerciseDto);
  }
}
