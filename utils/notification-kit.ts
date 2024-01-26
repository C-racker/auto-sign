import axios from 'axios';
import env from './env';

interface NotificationOptions {
  title: string;
  content: string;
  msgtype?: 'text' | 'html';
}

interface DingTalkOptions extends NotificationOptions {}

export class NotificationKit {
  /**
   * 钉钉Webhook
   * @param options
   */
  async dingtalkWebhook(options: DingTalkOptions) {
    const url: string | unknown = env.DINGDING_WEBHOOK;
    if (!url || url === '') {
      throw new Error('未配置钉钉Webhook。');
    }

    return axios.post(url as string, {
      msgtype: 'text',
      text: {
        content: `${options.title}\n${options.content}`,
      },
    });
  }

  async pushMessage(options: NotificationOptions) {
    const trycatch = async (name: string, fn: Function) => {
      try {
        await fn(options);
        console.log(`[${name}]: 消息推送成功!`);
      } catch (e: any) {
        console.log(`[${name}]: 消息推送失败! 原因: ${e.message}`);
      }
    };

    await trycatch('钉钉', this.dingtalkWebhook.bind(this));
  }
}

export default new NotificationKit();
