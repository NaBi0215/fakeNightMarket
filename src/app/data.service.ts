import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { EnvConfig } from '../../../../../env/config';
import { firstValueFrom, Observable } from 'rxjs';
// 自增組件
import { NightMarketConfig } from './environments/nightMarket';
import { ApiRoutes } from './environments/api-routes';
import { ParamsKey } from './environments/paramsKey';

export interface sendData {
  key: keyof typeof ParamsKey;
  value: any;
}
@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  // 組API URL 傳入API 的 key
  private ApiUrl(apiKey: keyof typeof ApiRoutes): any {
    // return `${EnvConfig.BACKEND_DOMAIN}${NightMarketConfig.projectRoute}${ApiRoutes[apiKey]}`;
  }

  // params 遍瀝 (輔助)
  // 格式化參數 將傳遞物件轉為特定格式給後端
  public prepareParams(paramsObj: { [key: string]: any }): sendData[] {
    return Object.entries(paramsObj).map(([key, value]) => ({
      // 確保如果沒有在ParamsKey中找到對應key 則直接使用原key
      key: ParamsKey[key as keyof typeof ParamsKey] || key,
      value,
    }));
  }

  // 異步post 串接api
  public sendRequest(
    apiKey: keyof typeof ApiRoutes,
    params?: sendData[]
  ): Observable<any> {
    const body: any = {};
    if (params && params.length > 0) {
      params.forEach((item) => {
        body[item.key] = item.value;
      });
    }
    const apiUrl = this.ApiUrl(apiKey);

    return this.http.post(apiUrl, body);
  }

  // 同步post 串接api
  public async sendRequestAsync(
    apiKey: keyof typeof ApiRoutes,
    params?: sendData[]
  ): Promise<any> {
    const body: any = {};

    if (params && params.length > 0) {
      params.forEach((params) => {
        body[ParamsKey[params.key]] = params.value;
      });
    }
    const apiUrl = this.ApiUrl(apiKey);

    try {
      const response = await firstValueFrom(this.http.post(apiUrl, body));
      return response;
    } catch (error) {
      console.error('API Error', error);
      throw error;
    }
  }
}
