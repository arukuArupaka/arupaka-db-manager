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
      scopes: [
        'https://www.googleapis.com/auth/forms.body', // フォーム作成・編集
        'https://www.googleapis.com/auth/forms.responses.readonly', // 回答取得
        // もし Drive に保存するなら以下も
        'https://www.googleapis.com/auth/drive.file',
      ],
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
          // 自由記述の質問
          {
            createItem: {
              location: { index: 0 },
              item: {
                title:
                  'ご氏名を教えてください（本名で苗字と名前の間はスペースを空けないでください）',
                questionItem: {
                  question: {
                    required: true,
                    textQuestion: {},
                  },
                },
              },
            },
          },
          // チェックボックス（複数選択）の質問
          {
            createItem: {
              location: { index: 1 },
              item: {
                title:
                  '参加可能日をお選びください（どちらも参加可能な場合は両方選択してください。）',
                questionItem: {
                  question: {
                    required: true,
                    choiceQuestion: {
                      // RADIO（単一選択）ではなく CHECKBOX（複数選択）を指定
                      type: 'CHECKBOX',
                      options: [
                        { value: '土曜日参加可能' },
                        { value: '日曜日参加可能' },
                        { value: 'どちらでも可' },
                        { value: '参加不可' },
                      ],
                    },
                  },
                },
              },
            },
          },
        ],
      },
    });
    this.logger.log('質問を追加しました');

    // 3) URL を取得して返却
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
    const answer = {};
    console.log('answers', answers);

    answers.forEach((ans: any) => {
      const keys = Object.keys(ans.answers);

      const nameValue = ans.answers[keys[0]];
      const contentValue = ans.answers[keys[1]];
      console.log('contentValue', contentValue);
      console.log('nameValue', nameValue);
      if (
        nameValue !== null &&
        nameValue !== undefined &&
        contentValue !== null &&
        contentValue !== undefined
      ) {
        const name = nameValue.textAnswers?.answers[0]?.value;
        console.log('name', name);
        const content = contentValue.textAnswers?.answers.map(
          (item: any) => item.value,
        );
        console.log('content', content);
        answer[name] = content;
      }
    });

    return {
      totalResponses: totalResponses,
      responses: answer,
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

    const memberList = new Map([
      ['sun', []],
      ['sat', []],
      ['no', []],
    ]);

    console.log('memberList', memberList);

    Object.keys(formatAttendanceFormResponse.responses).forEach((el) => {
      if (
        formatAttendanceFormResponse.responses[el]?.includes(
          '土曜日参加可能',
        ) ||
        formatAttendanceFormResponse.responses[el]?.includes('どちらでも可')
      ) {
        console.log('sat', el);
        const satList = memberList.get('sat') || [];
        satList.push(el);
        memberList.set('sat', satList);
      }

      if (
        formatAttendanceFormResponse.responses[el]?.includes(
          '日曜日参加可能',
        ) ||
        formatAttendanceFormResponse.responses[el]?.includes('どちらでも可')
      ) {
        console.log('sun', el);
        const sunList = memberList.get('sun') || [];
        sunList.push(el);
        memberList.set('sun', sunList);
      }

      if (formatAttendanceFormResponse.responses[el]?.includes('参加不可')) {
        console.log('no', el);
        const noList = memberList.get('no') || [];
        noList.push(el);
        memberList.set('no', noList);
      }
    });

    console.log('totalResponses', formatAttendanceFormResponse);

    console.log('contents', contents);

    console.log('member', memberList);

    const sat = contents.filter(
      (item: string) => item === '土曜日参加可能' || item === 'どちらでも可',
    ).length;
    const sun = contents.filter(
      (item: string) => item === '日曜日参加可能' || item === 'どちらでも可',
    ).length;

    if (sat > sun) {
      return {
        totalResponses: totalResponses,
        responses: { sat, sun },
        member: memberList,
        win: '土曜日に決まりました',
      };
    }
    if (sat < sun) {
      return {
        totalResponses: totalResponses,
        responses: { sat, sun },
        member: memberList,
        win: '日曜日に決まりました',
      };
    }
    return {
      totalResponses: totalResponses,
      responses: { sat, sun },
      member: memberList,
      win: '同数でした',
    };
  }
}
