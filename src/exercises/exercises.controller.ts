import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards, Req,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

@Controller('admin-exercises/exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Taọ execercise phía Admin' })
  create(@Body() createExerciseDto: CreateExerciseDto, @Req() req) {
    return this.exercisesService.create(createExerciseDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Cập nhật execercise phía Admin' })
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
    @Req() req,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Tìm tất execercise phía Admin' })
  findAll(@Req() req) {
    return this.exercisesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Tìm execercise bằng id phía Admin' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.exercisesService.findOne(id);
  }
}
