import { CloudflareStorage } from './cloudflare.storage';
import { IUploadProvider } from './upload.interface';
import { LocalStorage } from './local.storage';
import { FirebaseStorage } from './firebase.storage';
import { FirebaseService } from '@gitroom/nestjs-libraries/services/firebase.service';

export class UploadFactory {
  static createStorage(firebaseService?: FirebaseService): IUploadProvider {
    const storageProvider = process.env.STORAGE_PROVIDER || 'local';

    switch (storageProvider) {
      case 'local':
        return new LocalStorage(process.env.UPLOAD_DIRECTORY!);
      case 'cloudflare':
        return new CloudflareStorage(
          process.env.CLOUDFLARE_ACCOUNT_ID!,
          process.env.CLOUDFLARE_ACCESS_KEY!,
          process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
          process.env.CLOUDFLARE_REGION!,
          process.env.CLOUDFLARE_BUCKETNAME!,
          process.env.CLOUDFLARE_BUCKET_URL!
        );
      case 'firebase': {
        // Auto-resolve from static singleton if not explicitly passed
        const service = firebaseService || FirebaseService.getInstance();
        if (!service) {
          console.warn('FirebaseService not available, falling back to local storage');
          return new LocalStorage(process.env.UPLOAD_DIRECTORY || './uploads');
        }
        return new FirebaseStorage(service);
      }
      default:
        throw new Error(`Invalid storage type ${storageProvider}`);
    }
  }
}
