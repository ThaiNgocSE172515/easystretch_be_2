import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { CourseGuard } from '../guard/course.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @ApiOperation({
    summary:
      '[ADMIN, MANAGER] Tạo courses phía Admin và Manager (phase_number có nhiều week_number, week_number có 7 day_number)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Patch(":id")
  @ApiOperation({
    summary:
      '[ADMIN, MANAGER] Tạo courses phía Admin và Manager (phase_number có nhiều week_number, week_number có 7 day_number)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  update(@Param("id") id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Get()
  @ApiOperation({
    summary:
      '[ADMIN, MANAGER, USER] hiển thị danh sách course phía admin và user',
  })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get("/course-exercise")
  @ApiOperation({
    summary:
      '[ADMIN, MANAGER] hiển thị danh sách course chi tiết có cả ngày, tuần và exercise phía admin và manager',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  findAllExercise() {
    return this.coursesService.findAllExercise();
  }

  @Get('bought')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[User] hiển thị danh sách course đã mua',
  })
  getBoughtCourse(@Req() req: any) {
    return this.coursesService.getBoughtCourse(req.user.id);
  }

  @ApiOperation({
    summary: '[ADMIN, MANAGER] hiển thị chi tiết theo id (cả exercise, day, tuần trong course) course theo id phía Admin và Manager',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @ApiOperation({
    summary: '[User] hiển thị course theo id phía user đã mua',
  })
  @UseGuards(AuthGuard, CourseGuard)
  @ApiBearerAuth()
  @Get('payment/:course_id')
  findOneByPayment(@Param('course_id') id: string) {
    return this.coursesService.findOne(id);
  }


  @ApiOperation({
    summary: '[Admin và Management] hiển thị course theo id phía user đã mua',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCouse(id);
  }
}
