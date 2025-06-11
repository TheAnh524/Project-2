import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import {
  CreateQuizExerciseDto,
  CreateVideoLectureDto,
} from './create-lesson.dto';

class CombinedDto extends IntersectionType(
  CreateQuizExerciseDto,
  CreateVideoLectureDto,
) {}

export class UpdateLessonDto extends PartialType(CombinedDto) {}
