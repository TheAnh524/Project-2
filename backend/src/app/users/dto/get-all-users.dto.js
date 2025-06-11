import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class GetAllUsersDto {
  @ApiProperty({ example: 1, description: 'Trang hiện tại', default: 1 })
  @IsOptional()
  @IsPositive()
  page: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Số lượng tối đa 1 trang',
    default: 10,
  })
  @IsOptional()
  @IsPositive()
  limit: number = 10;

  @ApiProperty({
    example: '',
    description: 'Tìm kiếm tên',
    default: '',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
