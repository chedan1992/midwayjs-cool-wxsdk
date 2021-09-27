import { Inject, Logger } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import { CoolPlugin } from 'midwayjs-cool-core';
import { HttpService } from '@midwayjs/axios';

// @ts-ignore
import * as config from './package.json';
import authCode2Session from './dto/authCode2Session';

export class wxSdkHandler {
    wxConfig: any;
    @Logger()
    coreLogger: ILogger;

    @Inject('cool:coolPlugin')
    coolPlugin: CoolPlugin;

    @Inject()
    httpService: HttpService;
    /**
     * 登录凭证校验 https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
     * GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
     * appid
     * appSecret
     * js_code 登录时获取的 code
     */
    async authCode2Session(js_code: string): Promise<authCode2Session> {
        const { appid, appSecret } = await this.coolPlugin.getConfig(
            config.name.split('-')[2]
        );
        const host = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${js_code}&grant_type=authorization_code`;
        const result = await this.httpService.get<authCode2Session>(host);
        this.coreLogger.info(`authCode2Session:${host}:${result}`);
        return result.data;
    }
}
