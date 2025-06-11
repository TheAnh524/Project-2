import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('single')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadSingle(file);
  }
}
