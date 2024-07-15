import { md5 } from 'js-md5';
import axios from 'axios';
import notification from '../utils/notification-kit';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import qs from 'qs';

dayjs.extend(tz);
dayjs.extend(utc);

const memberIds = process.env.MEMBER_IDS.split(',');
function _0x5634f8() {
  let _0x537983;
  const _0x45a547 = arguments.length > 0x0 && void 0x0 !== arguments[0x0] ? arguments[0x0] : 0x10;
  let _0x5a4c27 = arguments.length > 0x1 && void 0x0 !== arguments[0x1] ? arguments[0x1] : 0x24;
  const _0x268d14 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
    _0x134f97 = [];
  let _0x4d50ee = 0x0;
  if (((_0x5a4c27 = _0x5a4c27 || _0x268d14.length), _0x45a547)) {
    for (_0x4d50ee = 0x0; _0x4d50ee < _0x45a547; _0x4d50ee++)
      _0x134f97[_0x4d50ee] = _0x268d14[0x0 | (Math['random']() * _0x5a4c27)];
  } else {
    for (
      _0x134f97[0x8] = _0x134f97[0xd] = _0x134f97[0x12] = _0x134f97[0x17] = '-', _0x134f97[0xe] = '4', _0x4d50ee = 0x0;
      _0x4d50ee < 0x24;
      _0x4d50ee++
    )
      _0x134f97[_0x4d50ee] ||
        ((_0x537983 = 0x0 | (0x10 * Math['random']())),
        (_0x134f97[_0x4d50ee] = _0x268d14[0x13 === _0x4d50ee ? (0x3 & _0x537983) | 0x8 : _0x537983]));
  }
  return _0x134f97.join('');
}

function getHeader(memberInfo) {
  const _0x57ff41 = function (_0x49eaee) {
    return md5(_0x49eaee).toString().toLocaleLowerCase();
  };

  const appInfo = {
    app_key: '5lOrfCGW',
    app_secret: '6dfzNDNkyi',
  };

  const code = _0x57ff41(_0x57ff41(qs.stringify(Object.assign(Object.assign({}, appInfo), memberInfo))))
    ['split']('')
    ['reverse']()
    ['join']('');

  const _0x1e9cef = Object.assign(
    {
      t: Math.floor(new Date().getTime() / 1000),
      n: _0x5634f8(),
    },
    appInfo,
  );
  const header = {
    app_key: appInfo.app_key,
    Sign: _0x57ff41(_0x57ff41(Object.values(_0x1e9cef).join('')))
      .split('')
      .reverse()
      .join(''),
    T: _0x1e9cef.t,
    N: _0x1e9cef.n,
    // Uuid: '9VSFYU81GRHA7H1W',
    code: code,
    platform_version_name:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    tenancy_id: 'banu',
    Referer: 'https://cdn-scp.banu.cn/',
  };
  // console.log('header :', header);
  return header;
}

async function sign(info) {
  const memberInfo = { member_id: info };
  try {
    const sign = await axios.post('https://cloud.banu.cn/api/sign-in', memberInfo, { headers: getHeader(memberInfo) });
    const userInfo = await axios.get('https://cloud.banu.cn/api/member/statistic', {
      headers: getHeader(memberInfo),
      params: memberInfo,
    });
    await notification.pushMessage({
      title: '巴奴每日签到',
      content: `ID：${info}
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
