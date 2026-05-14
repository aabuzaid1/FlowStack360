import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

/**
 * Firebase Module - يوفر FirebaseService عالمياً في كامل التطبيق
 * يشمل: Firebase Authentication + Firebase Storage
 */
@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
