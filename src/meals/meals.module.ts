import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [MealsController],
  providers: [MealsService],
  imports: [SupabaseModule]
})
export class MealsModule {}
