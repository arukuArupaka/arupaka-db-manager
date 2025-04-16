import { Injectable, Logger } from '@nestjs/common';
import { forms } from '@googleapis/forms';
import { JWT } from 'google-auth-library';
import { AttendanceFormAnswerPayload } from './interface/attendance-form-answer.payload';

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

  /**
   * フォームを作成するメソッド
   * @returns
   */
  async createSampleForm(): Promise<{ editId: string; publicUrl: string }> {
    const authClient = await this.auth();
    const formsClient = forms({ version: 'v1', auth: authClient });

    // 1) 空のフォームを作成
    const {
      data: { formId },
    } = await formsClient.forms.create({
      requestBody: {
        info: {
          title: '参加申込フォーム',
          documentTitle: '土日参加可能可否のアンケート',
        },
      },
    });
    this.logger.log(`作成されたフォームID(editId): ${formId}`);

    // 2) 質問を一括追加
    await formsClient.forms.batchUpdate({
      formId,
      requestBody: {
        requests: [
          {
            createItem: {
              location: { index: 0 },
              item: {
                title: 'ご氏名を教えてください',
                questionItem: {
                  question: {
                    required: true,
                    textQuestion: {},
                  },
                },
              },
            },
          },
          {
            createItem: {
              location: { index: 1 },
              item: {
                title: '参加可能日をお選びください',
                questionItem: {
                  question: {
                    required: true,
                    checkboxQuestion: {
                      options: [
                        { value: '土曜日参加可能' },
                        { value: '日曜日参加可能' },
                      ],
                    },
                  } as any,
                },
              },
            },
          },
        ],
      },
    });
    this.logger.log('質問を追加しました');

    await formsClient.forms.setPublishSettings({
      formId,
      requestBody: {
        publishSettings: {
          publishState: {
            isPublished: true,
            isAcceptingResponses: true,
          },
        },
      },
    });
    this.logger.log('公開設定を反映しました');

    const { data: form } = await formsClient.forms.get({ formId });
    const publicUrl = form.responderUri!;
    this.logger.log(`公開フォームURL: ${publicUrl}`);

    return { editId: formId, publicUrl };
  }

  /**
   * フォームの回答を取得するメソッド
   * @param formId フォームID
   * @returns
   */
  async aggregateFormResponses(formId: string) {
    try {
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
<<<<<<< HEAD

  /**
   * 入力された日付が1週間以内かどうかを判定するメソッド
   * @param isoTimestamp
   * @returns
   */
  isWithinLastWeek(isoTimestamp: string): boolean {
    const date = new Date(isoTimestamp).getTime(); // 対象のUTC時刻 (ms)
    const now = Date.now(); // 現在時刻 (ms)
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000; // 1週間 = 7日
    return now - date <= oneWeekMs && now >= date;
  }

  /**
   * フォームの回答を整形するメソッド
   * @param res
   * @returns
   */
  formatAttendanceFormResponse(res: any): AttendanceFormAnswerPayload {
    const totalResponses = res.totalResponses;
    const answers = res.responses;

    answers.forEach((ans: any) => {
      const keys = Object.keys(ans);
      const answer = {};

      const nameValue = ans[keys[0]];
      const ContentValue = ans[keys[1]];
      if (
        nameValue !== null &&
        nameValue !== undefined &&
        ContentValue !== null &&
        ContentValue !== undefined
      ) {
        const name = nameValue.textAnswers?.answers[0]?.value;
        const content = ContentValue.textAnswers?.answers.map((item: any) => {
          if (!!this.isWithinLastWeek(ans.lastlastSubmittedTime))
            return item.value;
        });
        answer[name] = content;
      }
    });

    return {
      totalResponses: totalResponses,
      responses: answers,
    };
  }

  /**
   * フォームの回答を集計するメソッド
   * @returns
   */
  async collectAttendanceFormResponses(formId: string) {
    const formResponse = await this.aggregateFormResponses(formId);
    const formatAttendanceFormResponse =
      this.formatAttendanceFormResponse(formResponse);
    const totalResponses = formatAttendanceFormResponse.totalResponses;
    const contents = Object.values(
      formatAttendanceFormResponse.responses,
    ).flatMap((item: any) => item);

    const result = contents.reduce(
      (acc: any, curr: any) => {
        if (curr === '土曜日参加可能') acc.sat++;
        else acc.sun++;
      },
      { sat: 0, sun: 0 },
    );

    if (result.sat > result.sun) {
      return {
        totalResponses: totalResponses,
        responses: result.sat,
        win: 'sat',
      };
    }
    if (result.sat < result.sun) {
      return {
        totalResponses: totalResponses,
        responses: result.sun,
        win: 'sun',
      };
    }
    return {
      totalResponses: totalResponses,
      responses: result.sat,
      win: 'draw',
    };
  }
=======
>>>>>>> 51df6c7 (googleフォームとの連携完了)
}
