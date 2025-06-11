// src/app/topics/schemas/topic.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Topic extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
