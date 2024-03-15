import axios from 'axios';
import notification from '../utils/notification-kit';

const getJD = async () => {
  const sign = await axios.post(
    'https://comate.baidu.com/api/mall/order/redeem?goodsId=JD_50',
    {},
    { headers: { cookie: process.env.BAIDU_COOKIE } },
  );
  await notification.pushMessage({
    title: '百度code领取',
    content: `${sign.data}`,
    msgtype: 'text',
  });
  console.log('sign.data :', `${sign.data}`);
};
getJD();
