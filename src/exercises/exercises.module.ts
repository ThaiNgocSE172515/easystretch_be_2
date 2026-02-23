import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService],
  imports: [SupabaseModule]
})
export class ExercisesModule {}
