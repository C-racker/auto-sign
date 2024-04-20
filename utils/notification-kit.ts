import axios from 'axios';
import * as process from 'node:process';

const crypto = require('crypto');
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
    const access_token = process.env.DINGDING_WEBHOOK;
    const secret = process.env.DINGDING_SECRET;
    const timestamp = new Date().getTime().toString();
    const stringToSign = `${timestamp}\n${secret}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(stringToSign);
    const sign = encodeURIComponent(hmac.digest('base64'));
    return axios.post(
      `https://oapi.dingtalk.com/robot/send`,
      {
        msgtype: 'text',
        text: {
          content: `${options.title}\n${options.content}`,
        },
      },
      {
        params: { access_token, timestamp, sign },
      },
    );
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
