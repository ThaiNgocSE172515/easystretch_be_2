import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({
    summary: '[admin] Tạo courses phía admin',
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

  @ApiOperation({
    summary:
      '[admin: quản lý][user: hiển thị] hiển thị course theo phía admin và user',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }
}
