import { IsNotEmpty, IsOptional, IsMongoId, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  lesson: string;

  @IsMongoId()
  @IsOptional()
  user: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  @IsOptional()
  parent?: string;
}
