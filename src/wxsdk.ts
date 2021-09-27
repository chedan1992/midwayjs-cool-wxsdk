import { Inject, Logger } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import { CoolPlugin, PLUGINSTATUS } from 'midwayjs-cool-core';
import { HttpService } from '@midwayjs/axios';
import { ICoolWxsdk } from '.';

// @ts-ignore
import * as config from './package.json';
import authCode2Session from './dto/authCode2Session';

export class wxsdk implements ICoolWxsdk {
  wxConfig: any;
  @Logger()
  coreLogger: ILogger;

  @Inject('cool:coolPlugin')
  coolPlugin: CoolPlugin;

  @Inject()
  httpService: HttpService;

  async init() {
    return await this.checkStatus();
  }

  async checkStatus() {
    const { appid, appSecret } = await this.coolPlugin.getConfig(
      config.name.split('-')[2]
    );
    if (!appid || !appSecret) {
      return PLUGINSTATUS.NOCONF;
    }
    return PLUGINSTATUS.USABLE;
  }

  /**
   * 登录凭证校验 https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
   * GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
   * appid
   * appSecret
   * js_code 登录时获取的 code
   */
  async authCode2Session(js_code: string): Promise<authCode2Session> {
    const error = new authCode2Session();
    try {
      const { appid, appSecret } = await this.coolPlugin.getConfig(
        config.name.split('-')[2]
      );
      const host = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${js_code}&grant_type=authorization_code`;
      const result = await this.httpService.get<authCode2Session>(host);
      this.coreLogger.info(`authCode2Session:${result}`);
      if (result.status === 200) {
        return result.data;
      }
      error.errcode = result.status;
      error.errmsg = result.statusText;
    } catch (error) {
      this.coreLogger.error(`authCode2Session:${error}`);
      error.errmsg = error;
    }
    return error;
  }
}
