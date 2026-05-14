import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: admin.app.App;
  private initialized = false;

  // Static instance for access from UploadFactory without DI
  private static _instance: FirebaseService | null = null;
  static getInstance(): FirebaseService | null {
    return FirebaseService._instance;
  }

  onModuleInit() {
    if (!admin.apps.length) {
      const rawKey = process.env.FIREBASE_PRIVATE_KEY;
      if (!rawKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
        this.logger.warn(
          '⚠️ Firebase Admin SDK credentials not fully configured. Firebase features will be disabled.'
        );
        return;
      }

      try {
        // Handle various private key formats from .env files
        let privateKey = rawKey;
        // Replace literal \n sequences with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
        // Clean up any double-escaped sequences
        privateKey = privateKey.replace(/\\\\/g, '\\');

        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey,
          }),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
        this.initialized = true;
        FirebaseService._instance = this;
        this.logger.log(
          `✅ Firebase Admin initialized for project: ${process.env.FIREBASE_PROJECT_ID}`
        );
      } catch (e) {
        this.logger.warn(
          `⚠️ Firebase Admin SDK initialization failed: ${e}. Firebase features will be disabled. Please check your FIREBASE_PRIVATE_KEY format.`
        );
      }
    } else {
      this.app = admin.apps[0]!;
      this.initialized = true;
      FirebaseService._instance = this;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getAuth(): admin.auth.Auth {
    return admin.auth(this.app);
  }

  getStorage(): admin.storage.Storage {
    return admin.storage(this.app);
  }

  /**
   * التحقق من Firebase ID Token وإرجاع بيانات المستخدم
   */
  async verifyIdToken(
    idToken: string
  ): Promise<admin.auth.DecodedIdToken | null> {
    try {
      const decoded = await this.getAuth().verifyIdToken(idToken);
      return decoded;
    } catch (e) {
      this.logger.warn(`Invalid Firebase token: ${e}`);
      return null;
    }
  }

  /**
   * إنشاء مستخدم Firebase من البريد الإلكتروني وكلمة المرور
   */
  async createFirebaseUser(
    email: string,
    password: string,
    displayName?: string
  ): Promise<admin.auth.UserRecord> {
    return this.getAuth().createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });
  }

  /**
   * تحديث بيانات مستخدم Firebase
   */
  async updateFirebaseUser(
    uid: string,
    data: admin.auth.UpdateRequest
  ): Promise<admin.auth.UserRecord> {
    return this.getAuth().updateUser(uid, data);
  }

  /**
   * حذف مستخدم Firebase
   */
  async deleteFirebaseUser(uid: string): Promise<void> {
    return this.getAuth().deleteUser(uid);
  }

  /**
   * جلب مستخدم Firebase بالبريد الإلكتروني
   */
  async getUserByEmail(
    email: string
  ): Promise<admin.auth.UserRecord | null> {
    try {
      return await this.getAuth().getUserByEmail(email);
    } catch (e) {
      return null;
    }
  }

  /**
   * جلب مستخدم Firebase بالـ UID
   */
  async getUserByUid(uid: string): Promise<admin.auth.UserRecord | null> {
    try {
      return await this.getAuth().getUser(uid);
    } catch (e) {
      return null;
    }
  }

  /**
   * إنشاء Custom Token لتسجيل الدخول من الـ Backend
   */
  async createCustomToken(uid: string, claims?: object): Promise<string> {
    return this.getAuth().createCustomToken(uid, claims);
  }

  /**
   * رفع ملف إلى Firebase Storage
   */
  async uploadToStorage(
    buffer: Buffer,
    destination: string,
    mimeType: string
  ): Promise<string> {
    const bucket = this.getStorage().bucket();
    const file = bucket.file(destination);

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    this.logger.log(`✅ File uploaded to Firebase Storage: ${publicUrl}`);
    return publicUrl;
  }

  /**
   * حذف ملف من Firebase Storage
   */
  async deleteFromStorage(filePath: string): Promise<void> {
    try {
      const bucket = this.getStorage().bucket();
      await bucket.file(filePath).delete();
      this.logger.log(`✅ File deleted from Firebase Storage: ${filePath}`);
    } catch (e) {
      this.logger.warn(`Could not delete file from Firebase Storage: ${e}`);
    }
  }

  /**
   * إنشاء Signed URL مؤقت للملفات الخاصة
   */
  async getSignedUrl(filePath: string, expiresMs = 3600000): Promise<string> {
    const bucket = this.getStorage().bucket();
    const file = bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresMs,
    });
    return url;
  }
}
