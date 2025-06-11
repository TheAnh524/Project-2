// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleEnum } from '../enums/role.enum';

@Schema({ timestamps: true }) // tự động tạo createdAt và updatedAt
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: RoleEnum,
    default: RoleEnum.Student, // mặc định là học sinh
  })
  role: RoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
