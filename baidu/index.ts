import axios from 'axios';

const getJD = async () => {
  const sign = await axios.post(
    'https://comate.baidu.com/api/mall/order/redeem?goodsId=JD_50',
    {},
    { headers: { cookie: process.env.BAIDU_COOKIE } },
  );
  console.log('sign :', sign.data);
};
getJD();
