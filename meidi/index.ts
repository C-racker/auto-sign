import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import axios from 'axios';
import notification from '../utils/notification-kit';

dayjs.extend(tz);
dayjs.extend(utc);
let userInfo = null;
async function getUserInfo() {
  try {
    const headers = {
      Cookie: process.env.MEIDI_COOKIE,
      Referer: `https://servicewechat.com/wx03925a39ca94b161/428/page-frame.html`,
      Host: `mvip.midea.cn`,
      'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003123) NetType/WIFI Language/zh_CN`,
    };
    let result = await axios.get('https://mvip.midea.cn/next/mucuserinfo/getmucuserinfo', {
      headers: headers,
    });
    if (result.data.errcode === 0) {
      userInfo = result.data.data.userinfo;
      await signIn();
    } else {
      await notification.pushMessage({
        title: '美的会员',
        content: `${JSON.stringify(result.data)} 获取会员信息失败`,
        msgtype: 'text',
      });
    }
  } catch (e) {
    console.log(e);
  }
}
async function signIn() {
  try {
    const res = await axios.get('https://mvip.midea.cn/my/score/create_daily_score', {
      headers: {
        Cookie: process.env.MEIDI_COOKIE,
      },
    });
    await notification.pushMessage({
      title: '美的会员',
      content: `${JSON.stringify(res.data)}`,
      msgtype: 'text',
    });
  } catch (e) {
    console.log(e);
  }
}
getUserInfo();
