import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
// 自訂組件
import { DataService } from './data.service';
import { ResponseHandlerService } from './response-handler.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 共用 彈窗映射表
  isModalVisible: { [key: string]: boolean } = {
    isLogin: false,
    isRegister: false,
    isPWReset: false,
    isPasswordRevise: false,
    isPhoneRevise: false,
    isPrivacy: false,
    isTermsOfUse: false,
    // personal頁面
  };

  favoriteList: any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private responseHandlerService: ResponseHandlerService,
    private zone: NgZone
  ) {}

  // 彈窗控制
  showModal(modalName: string): void {
    this.isModalVisible[modalName] = true;
  }

  closeModal(modalName: string): void {
    this.isModalVisible[modalName] = false;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // 登入 (同步)
  async logIn(account: string, password: string): Promise<any> {
    const supplier = this.getSupplier();
    const params = this.dataService.prepareParams({
      account,
      password,
      supplier,
    });

    try {
      const response = await firstValueFrom(
        this.dataService.sendRequest('playerLogin', params)
      );
      const handleResponse =
        this.responseHandlerService.handleResponse(response);

      const token = handleResponse.token;
      if (token) {
        this.zone.run(() => {
          localStorage.setItem('token', token);
          localStorage.setItem('account', account);
          window.location.reload();
        });
      } else {
        throw new Error('未從登入回應中收到token');
      }
      return handleResponse;
    } catch (error) {
      throw error;
    }
  }

  // 取supplier
  private getSupplier(): string {
    const launchData = localStorage.getItem('launch');
    if (!launchData) return '';

    try {
      const parseData = JSON.parse(launchData);
      return parseData?.result.supplier || '';
    } catch (error) {
      return '';
    }
  }

  // 登出
  logout(): void {
    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');
    const params = this.dataService.prepareParams({
      token,
      account,
    });
    this.dataService
      .sendRequest('playerLogout', params)
      .subscribe((response: any) => {
        const handleResponse =
          this.responseHandlerService.handleResponse(response);
        if (handleResponse) {
          localStorage.removeItem('token');
          localStorage.removeItem('account');
          localStorage.removeItem('favoriteList');
          localStorage.removeItem('getPlayerProfiles');
          localStorage.removeItem('profileNickname');
          localStorage.removeItem('profileGender');
          localStorage.removeItem('profileBirthday');
          this.showModal('isLogin');
          this.router.navigate(['/index']);
        }
      });
  }

  // 註冊
  register(
    account: string,
    password: string,
    verifyCode: string
  ): Observable<any> {
    const supplier = this.getSupplier();
    const params = this.dataService.prepareParams({
      account,
      password,
      supplier,
      verifyCode,
    });
    console.log('params', params);
    return this.dataService.sendRequest('playerRegister', params);
  }

  // (忘記密碼)重設密碼
  resetPassword(
    phoneNumber: string,
    verifyCode: string,
    newPassword: string
  ): Observable<any> {
    const supplier = this.getSupplier();
    const account = phoneNumber;
    const params = this.dataService.prepareParams({
      verifyCode,
      newPassword,
      account,
      supplier,
    });
    return this.dataService.sendRequest('playerProfilesPasswordReset', params);
  }

  // 修改密碼
  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('token');
    const params = this.dataService.prepareParams({
      oldPassword,
      newPassword,
      token,
    });
    return this.dataService.sendRequest('playerProfilesPasswordEdit', params);
  }

  // 修改電話
  updatePhone(phoneNumber: string, verifyCode: string): Observable<any> {
    const token = localStorage.getItem('token');
    const params = this.dataService.prepareParams({
      phoneNumber,
      verifyCode,
      token,
    });

    return this.dataService.sendRequest('editPlayerProfilesPhone', params);
  }

  // 獲取驗證碼
  getPhoneCaptcha(phoneNumber: string): Observable<any> {
    const params = this.dataService.prepareParams({
      phoneNumber: phoneNumber.toString(),
    });

    return this.dataService.sendRequest('getSnsVerification', params);
  }
}
