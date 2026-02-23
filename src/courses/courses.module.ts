import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [SupabaseModule],
  exports: [CoursesModule]
})
export class CoursesModule { }
