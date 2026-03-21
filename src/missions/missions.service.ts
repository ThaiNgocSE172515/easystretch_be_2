import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { AddMissionExerciseDto } from './dto/add-mission-exercise.dto';
import { UpdateMissionExerciseDto } from './dto/update-mission-exercise.dto';
import { CompleteMissionExerciseDto } from './dto/complete-mission-exercise.dto';

@Injectable()
export class MissionsService {
  private readonly logger = new Logger(MissionsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createMissionDto: CreateMissionDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('missions')
      .insert([createMissionDto])
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 201,
      success: true,
      message: 'Tạo nhiệm vụ thành công',
      data: data[0],
    };
  }

  async findAll(targetDate?: string) {
    const supabase = this.supabaseService.getClient();
    let query = supabase
      .from('missions')
      .select('*, mission_exercises(*, exercises(*))')
      .order('created_at', { ascending: false });

    if (targetDate) {
      query = query.eq('target_date', targetDate);
    }

    const { data, error } = await query;

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 200,
      success: true,
      message: 'Lấy danh sách nhiệm vụ thành công',
      data,
    };
  }

  async addExercise(missionId: string, addMissionExerciseDto: AddMissionExerciseDto) {
    const supabase = this.supabaseService.getClient();
    const exercisesToAdd = addMissionExerciseDto.exercises;

    if (!exercisesToAdd || exercisesToAdd.length === 0) {
      throw new BadRequestException('Danh sách bài tập trống.');
    }

    // 1. Kiểm tra các bài tập đã tồn tại trong nhiệm vụ
    const { data: existingRecords } = await supabase
      .from('mission_exercises')
      .select('exercise_id')
      .eq('mission_id', missionId);

    const existingIds = existingRecords?.map(e => e.exercise_id) || [];
    
    // Lọc ra những bài tập chưa được thêm
    const newExercises = exercisesToAdd.filter(
      (item) => !existingIds.includes(item.exercise_id)
    );

    if (newExercises.length === 0) {
      throw new BadRequestException('Tất cả bài tập này đều đã có trong nhiệm vụ.');
    }

    // 2. Lấy order cao nhất hiện tại
    const { data: maxOrderData } = await supabase
      .from('mission_exercises')
      .select('order')
      .eq('mission_id', missionId)
      .order('order', { ascending: false })
      .limit(1)
      .maybeSingle();

    let currentMaxOrder = maxOrderData?.order || 0;

    // 3. Chuẩn bị payload
    const payload = newExercises.map((item) => {
      currentMaxOrder++;
      return {
        mission_id: missionId,
        exercise_id: item.exercise_id,
        point: item.point,
        order: currentMaxOrder,
      };
    });

    // 4. Insert nhiều bài tập cùng lúc
    const { data, error } = await supabase
      .from('mission_exercises')
      .insert(payload)
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    return {
      code: 201,
      success: true,
      message: `Thêm ${payload.length} bài tập vào nhiệm vụ thành công`,
      data: data,
    };
  }

  async completeExercise(userId: string, body: CompleteMissionExerciseDto) {
    const { mission_id, exercise_id } = body;
    const supabase = this.supabaseService.getClient();

    // 1. Kiểm tra (Chỉ tính trong ngày hôm nay)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data: checkHasDone } = await supabase
      .from('user_mission_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('mission_id', mission_id)
      .eq('exercise_id', exercise_id)
      .gte('completed_at', startOfDay.toISOString())
      .lte('completed_at', endOfDay.toISOString())
      .maybeSingle();

    if (checkHasDone) {
      throw new BadRequestException('Bạn đã hoàn thành và nhận điểm bài tập này trong ngày hôm nay rồi. Ngày mai quay lại nha!');
    }

    // 2. Lấy điểm
    const { data: missionEx, error: exError } = await supabase
      .from('mission_exercises')
      .select('point')
      .eq('mission_id', mission_id)
      .eq('exercise_id', exercise_id)
      .maybeSingle();

    if (!missionEx || exError) {
      throw new NotFoundException('Không tìm thấy bài tập trong nhiệm vụ này.');
    }

    // 3. Cập nhật
    const { error: historyError } = await supabase
      .from('user_mission_progress')
      .insert({
        user_id: userId,
        mission_id: mission_id,
        exercise_id: exercise_id,
        completed_at: new Date().toISOString()
      });

    if (historyError) throw new InternalServerErrorException('Lỗi lưu lịch sử: ' + historyError.message);

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('current_point')
      .eq('id', userId)
      .maybeSingle();

    const newPoint = (userProfile?.current_point || 0) + missionEx.point;

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ current_point: newPoint })
      .eq('id', userId);

    if (profileError) throw new InternalServerErrorException('Lỗi cập nhật điểm: ' + profileError.message);

    return {
      code: 200,
      success: true,
      message: `Bạn đã hoàn thành bài tập và được cộng ${missionEx.point} điểm!`,
      data: { current_point: newPoint },
    };
  }

  async update(id: string, updateMissionDto: UpdateMissionDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('missions')
      .update(updateMissionDto)
      .eq('id', id)
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data || data.length === 0) throw new NotFoundException('Không tìm thấy nhiệm vụ');

    return {
      code: 200,
      success: true,
      message: 'Cập nhật nhiệm vụ thành công',
      data: data[0],
    };
  }

  async remove(id: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('missions')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data || data.length === 0) throw new NotFoundException('Không tìm thấy nhiệm vụ');

    return {
      code: 200,
      success: true,
      message: 'Xóa nhiệm vụ thành công',
      data: data[0],
    };
  }

  async updateExercise(missionId: string, exerciseId: string, updateMissionExerciseDto: UpdateMissionExerciseDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('mission_exercises')
      .update(updateMissionExerciseDto)
      .eq('mission_id', missionId)
      .eq('exercise_id', exerciseId)
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data || data.length === 0) throw new NotFoundException('Không tìm thấy bài tập trong nhiệm vụ này');

    return {
      code: 200,
      success: true,
      message: 'Cập nhật bài tập trong nhiệm vụ thành công',
      data: data[0],
    };
  }

  async removeExercise(missionId: string, exerciseId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('mission_exercises')
      .delete()
      .eq('mission_id', missionId)
      .eq('exercise_id', exerciseId)
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data || data.length === 0) throw new NotFoundException('Không tìm thấy bài tập trong nhiệm vụ này');

    return {
      code: 200,
      success: true,
      message: 'Xóa bài tập khỏi nhiệm vụ thành công',
      data: data[0],
    };
  }
}
