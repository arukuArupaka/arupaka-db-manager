import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

const firebase_params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

admin.initializeApp(firebase_params);

@Injectable()
export class AuthService {
  async validateUser(idToken: string): Promise<any> {
    if (!idToken) throw new UnauthorizedException('認証されていません');

    try {
      const user = await admin.auth().verifyIdToken(idToken);
      return user;
    } catch (e) {
      throw new HttpException('Forbidden', e);
    }
  }
}
