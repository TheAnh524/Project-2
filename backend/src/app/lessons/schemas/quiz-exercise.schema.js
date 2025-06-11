import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Lesson } from './lessons.schema';

class Question {
  @Prop({ required: true })
  question: string;

  @Prop({
    type: Map,
    of: String,
    required: true,
  })
  options: Record<string, string>;

  @Prop({ required: true })
  correctAnswer: string;
}

@Schema()
export class QuizExercise extends Lesson {
  @Prop({ type: [Question], required: true })
  @Type(() => Question)
  questions: Question[];
}

export const QuizExerciseSchema = SchemaFactory.createForClass(QuizExercise);
