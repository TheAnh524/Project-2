import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ example: 'Toán học', description: 'Tên chủ đề' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Ảnh chủ đề',
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}
