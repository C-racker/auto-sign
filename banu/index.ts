import { md5 } from 'js-md5';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import qs from 'qs';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import notification from '../utils/notification-kit';

dayjs.extend(tz);
dayjs.extend(utc);

// 为了存活久一点留给动手能力强的人~~~
const key = process.env.BANU_KEY;
const memberIds = process.env.MEMBER_IDS.split(',');
function uuid() {
  var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 16,
    ce = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 36,
    se = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
    pe = [],
    de = 0;
  if (((ce = ce || se.length), n)) for (de = 0; de < n; de++) pe[de] = se[0 | (Math.random() * ce)];
  else {
    var le = void 0;
    for (pe[8] = pe[13] = pe[18] = pe[23] = '-', pe[14] = '4', de = 0; de < 36; de++)
      pe[de] || ((le = 0 | (16 * Math.random())), (pe[de] = se[19 === de ? (3 & le) | 8 : le]));
  }
  return pe.join('');
}
function getHeader(info, enc_data?) {
  const _md5 = function (str) {
    return md5(str).toString().toLocaleLowerCase();
  };
  const appInfo = { app_key: 'KlZ4LqOF', app_secret: 'HoBJTYXdwn' };
  const signData = Object.assign({ t: Math.floor(new Date().getTime() / 1000), n: uuid() }, appInfo);
  const signStr = Object.values(signData).join('');
  const sign = _md5(_md5(signStr)).split('').reverse().join('');
  let header: any = {
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.50(0x18003232) NetType/WIFI Language/zh_CN',
    'Accept-Encoding': 'gzip,compress,br,deflate',
    'Content-Type': 'application/json',
    uuid: info.uuid,
    platform_version_code: 'iOS 18.0',
    version: '6.1.5',
    authorization: info.authorization,
    tenancy_id: 'banu',
    app_key: appInfo.app_key,
    source: '',
    platform_version_name: 'iPhone 14 Pro Max<iPhone15,3>',
    platform_version_weapp: '8.0.50',
    t: signData.t,
    n: signData.n,
    platform_version_sdk: '3.5.1',
    sign: sign,
    Referer: 'https://servicewechat.com/wx71373698c47f9a9f/441/page-frame.html',
  };
  if (enc_data) {
    const qsStr = qs.stringify({ ...appInfo, enc_data });
    const code = _md5(_md5(qsStr)).split('').reverse().join('');
    header = { ...header, code };
  }
  return header;
}

function getData(memberInfo) {
  const iv = CryptoJS.lib.WordArray.random(16).toString();
  const encryptStr = JSON.stringify(memberInfo);
  const encrypted_data = CryptoJS.AES.encrypt(encryptStr, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  }).toString();
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify({ iv, encrypted_data })));
}

async function sign(infoStr) {
  let pairs = infoStr.split(';');
  let info: any = {};
  pairs.forEach((pair) => {
    let [key, value] = pair.split('=');
    info[key] = value;
  });
  const memberInfo = { member_id: info.member_id };
  try {
    const enc_data = getData(memberInfo);
    const sign = await axios.post(
      'https://cloud.banu.cn/api/sign-in',
      { enc_data: enc_data },
      { headers: getHeader(info, enc_data) },
    );
    const userInfo = await axios.get('https://cloud.banu.cn/api/member/statistic', {
      headers: getHeader(info),
      params: memberInfo,
    });
    await notification.pushMessage({
      title: '巴奴每日签到',
      content: `ID：${info.member_id}
    用户名：${userInfo.data.data.name}
    签到时间：${dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')}
    当前积分：${userInfo.data.data.points}
    签到状态：${sign.data.message}`,
      msgtype: 'text',
    });
  } catch (e) {
    await notification.pushMessage({
      title: '巴奴每日签到',
      content: `签到失败：${e}
    签到时间：${dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')}
    `,
      msgtype: 'text',
    });
  }
}

for (let i = 0; i < memberIds.length; i++) {
  setTimeout(() => {
    sign(memberIds[i]);
  }, Math.random() * 100000);
}
