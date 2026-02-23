import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsController } from './foods.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [FoodsController],
  providers: [FoodsService],
  imports: [SupabaseModule]
})
export class FoodsModule {}
