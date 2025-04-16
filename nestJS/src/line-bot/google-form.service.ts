import { Injectable, Logger } from '@nestjs/common';
import { forms } from '@googleapis/forms';
import { JWT } from 'google-auth-library';

@Injectable()
export class GoogleFormService {
  constructor() {}
  private readonly logger = new Logger(GoogleFormService.name);

  // Google Forms APIの認証を行うメソッド
  private async auth(): Promise<JWT> {
    // サービスアカウントの認証情報を環境変数から取得
    const clientEmail = process.env.CLIENT_EMAIL;
    const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!clientEmail || !privateKey) {
      throw new Error(
        '必要な環境変数(CLIENT_EMAIL, PRIVATE_KEY, GOOGLE_FORM_ID)が設定されていません',
      );
    }

    // JWT クライアントの作成。指定したスコープに応じた認証情報を発行します。
    const authClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/forms.responses.readonly'],
    });

    await authClient.authorize();

    return authClient;
  }

  // 環境変数からフォームIDを取得
  async aggregateFormResponses() {
    try {
      const formId = process.env.GOOGLE_FORM_ID;
      if (!formId) {
        throw new Error('GOOGLE_FORM_IDが設定されていません');
      }

      const authClient = await this.auth();
      const formsClient = forms({ version: 'v1', auth: authClient });
      const response = await formsClient.forms.responses.list({ formId });
      const responses = response.data.responses || [];
      const totalResponses = responses.length;
      return { totalResponses, responses };
    } catch (error) {
      this.logger.error('Error aggregating form responses', error);
      if (error.response) {
        this.logger.error(`HTTP Status: ${error.response.status}`);
        this.logger.error(
          `Response Data: ${JSON.stringify(error.response.data)}`,
        );
      }
      throw error;
    }
  }
}
