// create-lesson.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  IsArray,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsOptional()
  number: number;

  @IsString()
  @IsNotEmpty()
  topic: string;
}

// --- Quiz Exercise DTO ---
class QuestionDto {
  @IsString()
  question: string;

  @IsObject()
  options: Record<string, string>;

  @IsString()
  correctAnswer: string;
}

export class CreateQuizExerciseDto extends CreateLessonDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

// --- Video Lecture DTO ---
export class CreateVideoLectureDto extends CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  videoUrl: string;
}
