import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly s3 = new S3Client({
    region: 'ru-central1',
    endpoint: 'https://storage.yandexcloud.net',
    credentials: {
      accessKeyId: process.env.YC_S3_KEY_ID!,
      secretAccessKey: process.env.YC_S3_SECRET!,
    },
  });

  private readonly bucket = 'web-lab';

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${randomUUID()}-${file.originalname}`;
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));
    return `https://storage.yandexcloud.net/${this.bucket}/${key}`;
  }
}
