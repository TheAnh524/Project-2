import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { RoleEnum } from 'src/app/users/enums/role.enum';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID của user' })
  @Expose()
  _id: string;

  @ApiProperty({ example: 'Nguyen Van A', description: 'Họ và tên' })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: RoleEnum.Student,
    enum: RoleEnum,
    description: 'Vai trò người dùng (teacher hoặc student)',
  })
  @Expose()
  role: RoleEnum;
}
