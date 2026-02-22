import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { GuardModule } from './guard/guard.module';
import { ExercisesModule } from './exercises/exercises.module';
import { CoursesModule } from './courses/courses.module';
import { FoodsModule } from './foods/foods.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SupabaseModule, UsersModule, GuardModule, ExercisesModule, CoursesModule, FoodsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
