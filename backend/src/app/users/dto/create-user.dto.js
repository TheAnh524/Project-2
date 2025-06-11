import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '../enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Họ và tên' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: RoleEnum.Student,
    enum: RoleEnum,
    description: 'Vai trò người dùng (teacher hoặc student)',
  })
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: RoleEnum;
}
