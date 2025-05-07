import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
// 自訂組件
import { AuthService } from '../auth.service';
import { ResponseHandlerService } from '../response-handler.service';
import { NightMarketConfig } from '../environments/nightMarket';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  // 登入
  @ViewChild('countryCode') countryCode!: ElementRef;
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  @ViewChild('captchaCanvas', { static: false })
  captchaCanvas!: ElementRef<HTMLCanvasElement>;
  //註冊
  @ViewChild('rg_phoneInput') rg_phoneInput!: ElementRef;
  @ViewChild('rg_countryCode') rg_countryCode!: ElementRef;
  // 重設密碼
  @ViewChild('fg_phoneInput') fg_phoneInput!: ElementRef;
  @ViewChild('fg_countryCode') fg_countryCode!: ElementRef;

  @Input() logoUrl: string | null = null;

  constructor(
    public authService: AuthService,
    private responseHandlerService: ResponseHandlerService
  ) {}

  // 彈窗集中管理
  [key: string]: boolean | number | any;
  // 帳號登入彈窗 (初始不顯示)
  isAccountLogin: boolean = false;
  // 大頭照
  personalImgUrl: string | null = null;

  // 暱稱
  personalNickname: string | null = null;
  // form ngModel 雙向綁定
  password: string = '';
  rg_phone: string = '';
  rg_phone_captcha: string = '';
  rg_password: string = '';
  passwordCheck: string = '';
  statute: boolean = false;
  name: string = '';
  fg_email: string = '';
  fg_captchaInput: string = '';
  fg_phone_captcha: string = '';
  captcha: string = '';
  newPW: string = '';

  // 繪製驗證碼
  captchaTxt: string = '';
  captchaInput: string = '';
  // 註冊驗證碼 計時器
  rg_countdown: number = 0;
  rg_countdownInterval: any;
  rg_isCountdownActive: boolean = false;
  // 註冊 鎖定驗證碼
  rg_isDisabled = false;
  // 忘記密碼驗證碼 計時器
  fg_countdown: number = 0;
  fg_countdownInterval: any;
  fg_isCountdownActive: boolean = false;
  // 忘記密碼 鎖定驗證碼
  fg_isDisabled = false;

  ngOnInit(): void {
    this.personalImgUrl =
      localStorage.getItem('profilePic') || NightMarketConfig.personalImgUrl;
    this.personalNickname =
      localStorage.getItem('profileNickname') || '親愛的玩家';
    const storedData = localStorage.getItem('launch');

    if (storedData) {
      this.logoUrl = JSON.parse(storedData).result.logoUrl;
    }

    this.updateCountdown('rg');
    this.updateCountdown('fg');
  }

  showAccountForm() {
    this.isAccountLogin = true;
  }

  logIn() {
    const phoneNumber = this.getPhoneNumber(this.countryCode, this.phoneInput);
    const password = this.password;

    if (!phoneNumber || !password || !this.captchaInput) {
      return alert('請填寫所有欄位');
    }

    if (this.captchaInput !== this.captchaTxt) {
      alert('驗證碼錯誤，請再試一次');
      this.captchaInput = '';
      this.generateCaptcha();
      return;
    }

    this.authService.logIn(phoneNumber, password).then((response) => {
      if (response) {
        this.authService.closeModal('isLogin');
      }
    });
  }

  // 共用 計時器
  startCountdown(prefix: string, countdown: number = 120) {
    // 是否已在倒數中
    if (this[`${prefix}_isCountdownActive`]) return;

    // 啟動計時器
    this[`${prefix}_isCountdownActive`] = true;
    this[`${prefix}_countdown`] = countdown;
    this[`${prefix}_isDisabled`] = true;

    // 計算過期時間
    const expireTime = Date.now() + this[`${prefix}_countdown`] * 1000;
    localStorage.setItem(`${prefix}_expireTime`, expireTime.toString());

    // 計時開始
    this[`${prefix}_countdownInterval`] = setInterval(() => {
      if (this[`${prefix}_countdown`] > 0) {
        this[`${prefix}_countdown`]--;
      } else {
        clearInterval(this[`${prefix}_countdownInterval`]);
        this[`${prefix}_isCountdownActive`] = false;
        this[`${prefix}_isDisabled`] = false;
      }
    }, 1000);
  }

  // 共用 更新計時器
  updateCountdown(prefix: string) {
    const savedExpireTime = localStorage.getItem(`${prefix}_expireTime`);

    if (!savedExpireTime || isNaN(Number(savedExpireTime))) {
      return;
    }

    const expireTime = parseInt(savedExpireTime, 10);
    const now = Date.now();
    const remaining = Math.floor((expireTime - now) / 1000);

    if (remaining > 0) {
      this[`${prefix}_countdown`] = remaining;
      this[`${prefix}_isCountdownActive`] = true;

      this[`${prefix}_countdownInterval`] = setInterval(() => {
        if (this[`${prefix}_countdown`] > 0) {
          this[`${prefix}_countdown`]--;
        } else {
          clearInterval(this[`${prefix}_countdownInterval`]);
          this[`${prefix}_isCountdownActive`] = false;
          localStorage.removeItem(`${prefix}_expireTime`);
        }
      }, 1000);
    } else {
      this[`${prefix}_isCountdownActive`] = false;
      localStorage.removeItem(`${prefix}_expireTime`);
    }
  }

  // 共用 組合電話號碼
  getPhoneNumber(
    countryCodeElement: any,
    phoneInputElement: any
  ): string | null {
    const countryCode = countryCodeElement?.nativeElement.value;
    const phoneInput = phoneInputElement?.nativeElement.value;

    if (!phoneInput || phoneInput.trim() === '') {
      return null;
    }

    return `${countryCode}${phoneInput}`.trim();
  }

  register() {
    const rg_phoneInput = this.rg_phoneInput?.nativeElement.value;
    const phoneNumber =
      this.getPhoneNumber(this.rg_countryCode, this.rg_phoneInput) || '';
    const verifyCode = this.rg_phone_captcha;
    const rg_password = this.rg_password;
    const passwordCheck = this.passwordCheck;
    const statute = this.statute;

    if (
      !rg_phoneInput ||
      !verifyCode ||
      !rg_password ||
      !passwordCheck ||
      !statute
    ) {
      alert('請填寫所有欄位');
      return;
    }

    if (rg_password.length < 9 || rg_password.length > 19) {
      alert('密碼長度最少9位數，最多20位數');
      return;
    }

    if (rg_password !== passwordCheck) {
      alert('密碼與確認密碼不一致');
      return;
    }

    this.authService
      .register(phoneNumber, rg_password, verifyCode)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          alert('註冊成功，請再次登入');
          this.authService.closeModal('isRegister');
          this.authService.showModal('isLogin');
          return;
        }
      });
  }

  // 共用 獲取註冊碼 簡單判斷
  getPhoneCheck(
    prefix: string,
    countryCodeElement: any,
    phoneInputElement: any
  ): void {
    const phoneNumber = this.getPhoneNumber(
      countryCodeElement,
      phoneInputElement
    );

    if (!phoneNumber) {
      alert('請輸入電話號碼');
      return;
    }

    this.authService.getPhoneCaptcha(phoneNumber).subscribe((response: any) => {
      const resultData = this.responseHandlerService.handleResponse(response);
      if (resultData) {
        alert('簡訊驗證碼已發送');
        this.startCountdown(prefix, 120);
      } else {
        alert('簡訊發送失敗，請稍後再試');
      }
    });
  }

  // 註冊部分
  rg_getPhoneCheck(): void {
    this.getPhoneCheck('rg', this.rg_countryCode, this.rg_phoneInput);
  }

  // 忘記密碼部分
  fg_getPhoneCheck(): void {
    this.getPhoneCheck('fg', this.fg_countryCode, this.fg_phoneInput);
  }

  resetPassword() {
    const phoneNumber = this.getPhoneNumber(
      this.fg_countryCode,
      this.fg_phoneInput
    );
    const verifyCode = this.fg_phone_captcha;
    const newPassword = this.newPW;

    if (!phoneNumber || !verifyCode || !newPassword) {
      alert('請填寫所有欄位');
      return;
    }

    if (newPassword.length < 9 || newPassword.length > 19) {
      alert('密碼長度最少9位數，最多20位數');
      return;
    }

    this.authService
      .resetPassword(phoneNumber, verifyCode, newPassword)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          alert('重設密碼成功，請再次登入');
          this.authService.closeModal('isPWReset');
          this.authService.showModal('isLogin');
          return;
        }
      });
  }

  // 登入 註冊 忘記密碼(blur)使用
  validatePhone(countryCode: string, phoneInput: string): void {
    const phoneNumber = `${countryCode}${phoneInput}`.trim();
    localStorage.setItem('account', phoneNumber);

    if (!phoneInput.match(/^[0-9]{8,10}$/)) {
      alert('請輸入有效的電話號碼');
      return;
    }
  }

  // 繪製驗證碼
  generateCaptcha(): void {
    const chars = '0123456789';
    this.captchaTxt = Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');

    const canvas = this.captchaCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景顏色
    ctx.fillStyle = '#b6b6b6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 干擾線條
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${
        Math.random() * 255
      }, 0.8)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 繪製文字
    ctx.font = '24px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < this.captchaTxt.length; i++) {
      const x = (i + 0.5) * (canvas.width / this.captchaTxt.length);
      const y = canvas.height / 2;
      ctx.fillText(this.captchaTxt[i], x, y);
    }
  }
}
