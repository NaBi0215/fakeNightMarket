import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// 自創組件
import { AuthService } from '../../auth.service';
import { DataService } from '../../data.service';
import { ResponseHandlerService } from '../../response-handler.service';
import { NightMarketConfig } from '../../environments/nightMarket';
// UI組件
import { HeaderComponent } from '../../header/header.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { CopyrightComponent } from '../../copyright/copyright.component';
import { PurseComponent } from '../../purse/purse.component';
import { LampBallComponent } from '../../lamp-ball/lamp-ball.component';
import { MarqueeComponent } from '../../marquee/marquee.component';
import { EggComponent } from '../../egg/egg.component';
import { OnlineBonusComponent } from '../../online-bonus/online-bonus.component';

interface profile {
  nickname: string;
  gender: string;
  birthday: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NavBarComponent,
    CopyrightComponent,
    FormsModule,
    PurseComponent,
    LampBallComponent,
    MarqueeComponent,
    EggComponent,
    OnlineBonusComponent,
  ],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss',
})
export class PersonalComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tooltip', { static: false }) tooltip!: ElementRef;
  @ViewChild('rv_countryCode') rv_countryCode!: ElementRef;
  @ViewChild('rv_phoneInput') rv_phoneInput!: ElementRef;
  @ViewChild('rv_phone_captcha') rv_phone_captcha!: ElementRef;

  logoUrl: string | null = null;
  hasImg: boolean = false;
  maxFileSize = 5 * 1024 * 1024;

  // 會員資料主頁
  profiles: profile = {} as profile;
  personalImgUrl: string = '';
  nickname: string = '';
  gender: string = '';
  birthday: string = '';
  phoneNumber: string = '';
  level: string = '';
  exp: string = '';

  // 會員資料帳密
  oldPassword: string = '';
  newPassword: string = '';
  passwordCheck: string = '';

  // 修改電話 計時器
  rv_countdown: number = 0;
  rv_countdownInterval: any;
  rv_isCountdownActive: boolean = false;
  rv_isDisabled: boolean = false;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private responseHandlerService: ResponseHandlerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // localstorage 取得logo
    this.logoUrl = localStorage.getItem('logoUrl');

    this.personalImgUrl =
      localStorage.getItem('profilePic') || NightMarketConfig.personalImgUrl;

    // 個人主頁
    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');
    const params = this.dataService.prepareParams({
      token,
      account,
    });

    this.dataService
      .sendRequest('getPlayerProfiles', params)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (!resultData) return;

        const storedData = localStorage.getItem('getPlayerProfiles');
        const isNewData =
          !storedData ||
          response.result.profiles.nickname !==
            JSON.parse(storedData).result.profiles.nickname;

        const dataToUse = isNewData ? response : JSON.parse(storedData || '{}');

        if (dataToUse) {
          localStorage.setItem('getPlayerProfiles', JSON.stringify(response));
          this.nickname = dataToUse.result.profiles.nickname || '';
          localStorage.setItem('profileNickname', this.nickname);
          this.gender = dataToUse.result.profiles.gender || '';
          this.birthday = dataToUse.result.profiles.birthday || '';
          this.phoneNumber = account || '';
          this.level = dataToUse.result.profiles.level;
          this.exp = dataToUse.result.profiles.exp;
        }
      });

    this.rvUpdateCountdown();
  }

  // 大頭照設置
  personalPicClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.hasImg = true;

      if (file.size > this.maxFileSize) {
        alert('圖片大小不能超過5MB');
        return;
      }

      const reader = new FileReader();

      // 當讀取完成時 將圖片預覽顯示在 personalImgUrl
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const maxWidth = 300;
          const maxHeight = 300;

          canvas.width = maxWidth;
          canvas.height = maxHeight;

          ctx?.beginPath();
          ctx?.arc(maxWidth / 2, maxHeight / 2, maxWidth / 2, 0, Math.PI * 2);
          ctx?.closePath();
          ctx?.clip();

          ctx?.drawImage(img, 0, 0, maxWidth, maxHeight);

          this.personalImgUrl = canvas.toDataURL('image/png');

          localStorage.setItem('profilePic', this.personalImgUrl);
        };
      };

      reader.readAsDataURL(file);
    }
  }

  // 複製推薦碼
  copyRecommendCode(): void {
    const textToCopy = (document.getElementById('recommendCode') as HTMLElement)
      .innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
      // 顯示提示框
      this.tooltip.nativeElement.classList.add('show');
      // 設置延遲隱藏
      setTimeout(() => {
        this.tooltip.nativeElement.classList.remove('show');
      }, 2000);
    });
  }

  saveChanges(): void {
    const storedNickname = localStorage.getItem('profileNickname');
    const storedGender = localStorage.getItem('profileGender');
    const storedBirthday = localStorage.getItem('profileBirthday');

    if (
      this.nickname === storedNickname &&
      this.gender === storedGender &&
      this.birthday === storedBirthday
    ) {
      alert('資料尚未有任何修改');
      return;
    }

    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');
    const nickname = this.nickname;
    const gender = this.gender;
    const birthday = this.birthday;

    const params = this.dataService.prepareParams({
      token,
      account,
      nickname,
      gender,
      birthday,
    });

    this.dataService
      .sendRequest('playerProfilesUpdate', params)
      .subscribe((response) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          localStorage.setItem('profileNickname', nickname);
          localStorage.setItem('profileGender', gender);
          localStorage.setItem('profileBirthday', birthday);
          alert('個人資料更新成功');
        }
      });
  }

  // 修改密碼 簡單判斷+調用authService
  revisePassword() {
    if (!this.oldPassword || !this.newPassword || !this.passwordCheck) {
      alert('請填寫所有欄位');
      return;
    }

    if (this.newPassword !== this.passwordCheck) {
      alert('新密碼與密碼確認不一致');
      return;
    }

    this.authService
      .updatePassword(this.oldPassword, this.newPassword)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          alert('修改密碼成功，請再次登入');
          this.authService.closeModal('isPasswordRevise');
          this.router.navigate(['/index']);
          this.authService.showModal('isLogin');
          this.authService.logout();
          return;
        }
        alert('修改密碼失敗，請稍後再試');
      });
  }

  validatePhone(rv_phoneInput: string): void {
    if (!rv_phoneInput.match(/^[0-9]{8,10}$/)) {
      alert('請輸入有效的電話號碼');
      return;
    }
  }

  // 修改電話 計時器
  rvStartCountdown() {
    if (this.rv_isCountdownActive) return;
    this.rv_isCountdownActive = true;
    this.rv_countdown = 120;
    this.rv_isDisabled = true;

    const expireTime = Date.now() + this.rv_countdown * 1000;
    localStorage.setItem('rv_expireTime', expireTime.toString());

    this.rv_countdownInterval = setInterval(() => {
      if (this.rv_countdown > 0) {
        this.rv_countdown--;
      } else {
        clearInterval(this.rv_countdownInterval);
        this.rv_isCountdownActive = false;
        this.rv_isDisabled = true;
      }
    }, 1000);
  }

  // 修改電話 更新計時器
  rvUpdateCountdown() {
    const savedExpireTime = localStorage.getItem('rv_expireTime');

    if (!savedExpireTime || isNaN(Number(savedExpireTime))) {
      return;
    }

    const expireTime = parseInt(savedExpireTime, 10);
    const now = Date.now();
    const remaining = Math.floor((expireTime - now) / 1000);

    if (remaining > 0) {
      this.rv_countdown = remaining;
      this.rv_isCountdownActive = true;

      this.rv_countdownInterval = setInterval(() => {
        if (this.rv_countdown > 0) {
          this.rv_countdown--;
        } else {
          clearInterval(this.rv_countdownInterval);
          this.rv_isCountdownActive = false;
          localStorage.removeItem('rv_expireTime');
        }
      }, 1000);
    } else {
      this.rv_isCountdownActive = false;
      localStorage.removeItem('rv_expireTime');
    }
  }

  // 修改電話 簡單判斷+認證碼
  rvPhoneCheck(): void {
    const rv_countryCode = this.rv_countryCode?.nativeElement.value;
    const rv_phoneInput = this.rv_phoneInput?.nativeElement.value;
    const phoneNumber = `${rv_countryCode}${rv_phoneInput}`.trim();

    if (!rv_phoneInput) {
      alert('請輸入電話號碼');
      return;
    }
    this.authService.getPhoneCaptcha(phoneNumber).subscribe((response: any) => {
      const resultData = this.responseHandlerService.handleResponse(response);
      if (resultData) {
        const now = Date.now();
        const expireTimestamp = now + resultData.expireTime;
        localStorage.setItem('rv_expireTime', expireTimestamp.toString());
        this.rv_countdown = Math.floor(expireTimestamp - now);

        alert('簡訊驗證碼已發送');
        this.rvStartCountdown();
      } else {
        alert('簡訊發送失敗，請稍後再試');
      }
    });
  }

  // 修改電話 簡單判斷+調用authService
  revisePhone() {
    const rv_countryCode = this.rv_countryCode?.nativeElement.value;
    const rv_phoneInput = this.rv_phoneInput?.nativeElement.value;
    const phoneNumber = `${rv_countryCode}${rv_phoneInput}`.trim();
    const verifyCode = this.rv_phone_captcha?.nativeElement.value;

    if (!rv_phoneInput || !verifyCode) {
      alert('請填寫所有欄位');
      return;
    }

    this.authService
      .updatePhone(phoneNumber, verifyCode)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          alert('修改電話成功，請再次登入');
          this.authService.logout();
          return;
        }
        alert('修改電話失敗，請稍後再試');
      });
  }
}
