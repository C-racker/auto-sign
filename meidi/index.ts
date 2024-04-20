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
      signIn();
    } else {
      await notification.pushMessage({
        title: '美的会员',
        content: `${JSON.stringify(result.data)}`,
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
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        cookie: process.env.MEIDI_COOKIE,
      },
    });
    if (res.data.errcode == 0) {
      await notification.pushMessage({
        title: '美的会员',
        content: `${userInfo.Nickname} 签到成功`,
        msgtype: 'text',
      });
    } else {
      await notification.pushMessage({
        title: '美的会员',
        content: `${userInfo.Nickname} ${JSON.stringify(res.data)}`,
        msgtype: 'text',
      });
    }
  } catch (e) {
    console.log(e);
  }
}
getUserInfo();
