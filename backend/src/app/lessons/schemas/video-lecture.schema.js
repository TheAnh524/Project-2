import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Lesson } from './lessons.schema';

@Schema()
export class VideoLecture extends Lesson {
  @Prop({ required: true })
  videoUrl: string;
}

export const VideoLectureSchema = SchemaFactory.createForClass(VideoLecture);
