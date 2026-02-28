import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guard/roles.guard';
import { AuthGuard } from '../guard/auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('question')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '[ADMIN, MANAGER]Hỏi chat về hệ thống' })
  async question(@Body() question: CreateAiDto) {
    return this.aiService.question(question);
  }
  @Post('question/nutritionist')
  @ApiOkResponse({ description: 'Hỏi chat về hệ thống' })
  async questionNutrition(@Body() question: CreateAiDto) {
    return this.aiService.questionNutrition(question);
  }
}
