import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LessonType } from '../enums/lesson-type.enum';

@Schema({ discriminatorKey: 'lessonType', timestamps: true })
export class Lesson extends Document {
  @Prop({ required: true, enum: LessonType })
  type: LessonType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  number: number;

  @Prop({ type: Types.ObjectId, ref: 'Topic', required: true })
  topic: Types.ObjectId; // Tham chiếu nhiều chủ đề
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
