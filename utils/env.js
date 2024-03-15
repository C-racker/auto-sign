const env = process.env || {};

module.exports = {
  MEMBER_IDS: env.MEMBER_IDS,
  /**
   * 钉钉配置
   * https://open.dingtalk.com/document/robots/custom-robot-access
   */
  DINGDING_WEBHOOK: env.DINGDING_WEBHOOK,
  BAIDU_COOKIE: env.BAIDU_COOKIE,
};
