import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Taọ execercise phía Admin' })
  create(@Body() createExerciseDto: CreateExerciseDto
  ) {
    return this.exercisesService.create(createExerciseDto);
  }
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Delete execercise bằng exercise id phía Admin' })
  delete(@Param('id') id: string
  ) {
    return this.exercisesService.delete(id);
  }

  @Get("client")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[User] Tìm tất execercise phía User' })
  findAllUser() {
    return this.exercisesService.findAll();
  }


  @Get('client/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[User] Tìm execercise bằng id phía User' })
  findOneUser(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Tìm tất execercise phía Admin' })
  findAll() {
    return this.exercisesService.findAll();
  }




  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Cập nhật execercise phía Admin' })
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN] Tìm execercise bằng id phía Admin' })
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }




}
