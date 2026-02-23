import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
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
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({
    summary:
      '[admin] Tạo courses phía admin (phase_number có nhiều week_number, week_number có 7 day_number)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({
    summary:
      '[admin: quản lý][user: hiển thị] hiển thị danh sách course phía admin và user',
  })
  findAll() {
    return this.coursesService.findAll();
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
    summary: '[admin: quản lý] hiển thị course theo id phía admin',
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


}
