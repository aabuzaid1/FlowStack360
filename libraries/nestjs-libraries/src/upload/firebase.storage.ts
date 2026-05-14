import { IUploadProvider } from './upload.interface';
import { FirebaseService } from '@gitroom/nestjs-libraries/services/firebase.service';
// @ts-ignore
import mime from 'mime';
import { extname } from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fromBuffer } = require('file-type');

const FIREBASE_STORAGE_ALLOWED_MIME = new Set<string>([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/bmp',
  'image/tiff',
  'video/mp4',
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/ogg',
]);

export class FirebaseStorage implements IUploadProvider {
  constructor(private firebaseService: FirebaseService) {}

  private generatePath(ext: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    return `uploads/${year}/${month}/${day}/${randomName}${ext}`;
  }

  async uploadSimple(path: string): Promise<string> {
    const response = await fetch(path);
    const contentType =
      response.headers.get('content-type') ||
      response.headers.get('Content-Type') ||
      'application/octet-stream';
    const ext =
      '.' + (mime.getExtension(contentType) || extname(path).slice(1) || 'bin');
    const buffer = Buffer.from(await response.arrayBuffer());
    const destination = this.generatePath(ext);

    return this.firebaseService.uploadToStorage(buffer, destination, contentType);
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const detected = await fromBuffer(file.buffer);
    if (!detected || !FIREBASE_STORAGE_ALLOWED_MIME.has(detected.mime)) {
      throw new Error('Unsupported file type.');
    }

    const safeExt = `.${detected.ext}`;
    const destination = this.generatePath(safeExt);

    const publicUrl = await this.firebaseService.uploadToStorage(
      file.buffer,
      destination,
      detected.mime
    );

    return {
      filename: destination.split('/').pop(),
      path: publicUrl,
      mimetype: detected.mime,
      originalname: file.originalname,
    };
  }

  async removeFile(filePath: string): Promise<void> {
    // استخراج المسار النسبي داخل الـ bucket من الـ URL الكامل
    const bucket = process.env.FIREBASE_STORAGE_BUCKET || '';
    const prefix = `https://storage.googleapis.com/${bucket}/`;
    const relativePath = filePath.startsWith(prefix)
      ? filePath.slice(prefix.length)
      : filePath;
    await this.firebaseService.deleteFromStorage(relativePath);
  }
}
