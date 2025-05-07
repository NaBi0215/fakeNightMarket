import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ResponseHandlerService {
  constructor(private router: Router) {}

  handleResponse(response: any): any {
    if (response && response.result) {
      const alertMessages: { [key: string]: string } = {
        '2002': '此email已註冊',
        '2003': '密碼無效',
        '2004': '此帳號無效',
        '2005': '密碼無效',
        '2006': '驗證碼無效或已過期',
        '2007': '此email無效',
      };
      const statusCodeActions: { [key: string]: () => any } = {
        '1000': () => response.result,
        '2001': () => {
          this.router.navigate(['/index']);
          localStorage.removeItem('token');
          localStorage.removeItem('account');
          return null;
        },
      };

      const alertMessage = alertMessages[response.info.statusCode];
      if (alertMessage) {
        alert(alertMessage);
        return null;
      }

      const action = statusCodeActions[response.info.statusCode];
      if (action) {
        return action();
      }

      console.log('服務器回傳錯誤,代碼:', response.info.statusCode);
      return null;
    }
  }
}
