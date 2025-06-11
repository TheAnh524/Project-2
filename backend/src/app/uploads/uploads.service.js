import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadsService {
  async uploadSingle(file: Express.Multer.File) {
    const fileUpload = await new Promise<UploadApiResponse | undefined>(
      (res, rej) => {
        cloudinary.uploader.upload_large(
          file.path,
          {
            folder: 'uploads',
            resource_type: 'auto',
          },
          (err, result) => {
            if (err) {
              rej(err);
            }
            res(result);
          },
        );
      },
    );

    if (!fileUpload) {
      throw new Error('File upload failed');
    }

    return {
      url: fileUpload.secure_url,
    };
  }
}
