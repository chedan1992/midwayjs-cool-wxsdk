import { ICoolPlugin } from 'midwayjs-cool-core';
export { AutoConfiguration as Configuration } from './configuration';
export * from './wxsdk';
import authCode2Session from './dto/authCode2Session';
export interface ICoolWxsdk extends ICoolPlugin {
  /**
   * 登录凭证校验 https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
   * appid
   * appSecret
   * js_code 登录时获取的 code
   */
  authCode2Session(js_code: string): Promise<authCode2Session>;
}
