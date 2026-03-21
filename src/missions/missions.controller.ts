import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { AddMissionExerciseDto } from './dto/add-mission-exercise.dto';
import { UpdateMissionExerciseDto } from './dto/update-mission-exercise.dto';
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

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật nhiệm vụ' })
  update(
    @Param('id') id: string,
    @Body() updateMissionDto: UpdateMissionDto,
  ) {
    return this.missionsService.update(id, updateMissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa nhiệm vụ' })
  remove(@Param('id') id: string) {
    return this.missionsService.remove(id);
  }

  @Patch(':missionId/exercise/:exerciseId')
  @ApiOperation({ summary: 'Cập nhật bài tập trong nhiệm vụ' })
  updateExercise(
    @Param('missionId') missionId: string,
    @Param('exerciseId') exerciseId: string,
    @Body() updateMissionExerciseDto: UpdateMissionExerciseDto,
  ) {
    return this.missionsService.updateExercise(missionId, exerciseId, updateMissionExerciseDto);
  }

  @Delete(':missionId/exercise/:exerciseId')
  @ApiOperation({ summary: 'Xóa bài tập khỏi nhiệm vụ' })
  removeExercise(
    @Param('missionId') missionId: string,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.missionsService.removeExercise(missionId, exerciseId);
  }
}
