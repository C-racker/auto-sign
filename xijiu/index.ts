import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import axios from 'axios';
import notification from '../utils/notification-kit';

dayjs.extend(tz);
dayjs.extend(utc);
let userInfo = null;
const headers = {
  Authorization: process.env.XIJIU_TOKEN,
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF WindowsWechat(0x63090a13) XWEB/9129',
};
async function getUserInfo() {
  try {
    let result = await axios.get('https://apimallwm.exijiu.com/member/info', {
      headers: headers,
    });
    userInfo = result.data.data;
    await signIn();
  } catch (e) {
    console.log(e);
  }
}
async function signIn() {
  try {
    const res = await axios.get('https://apimallwm.exijiu.com/member/signin/sign', {
      headers: headers,
    });
    await notification.pushMessage({
      title: '习酒小程序',
      content: `${userInfo.nick_name} 当前积分：${userInfo.integration}
${JSON.stringify(res.data)}`,
      msgtype: 'text',
    });
  } catch (e) {
    console.log(e);
  }
}
getUserInfo();
