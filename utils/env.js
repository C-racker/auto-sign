const env = process.env || {};

module.exports = {
  /**
   * 钉钉配置
   * https://open.dingtalk.com/document/robots/custom-robot-access
   */
  DINGDING_WEBHOOK: env.DINGDING_WEBHOOK,
  DINGDING_SECRET: env.DINGDING_SECRET,
  BAIDU_COOKIE: env.BAIDU_COOKIE,
  MEIDI_COOKIE: env.MEIDI_COOKIE,
  MEMBER_IDS: env.MEMBER_IDS,
  XIJIU_TOKEN: env.XIJIU_TOKEN,
};
