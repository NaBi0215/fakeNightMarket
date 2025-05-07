import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// 自訂組件
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { ResponseHandlerService } from '../response-handler.service';

@Component({
  selector: 'app-purse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purse.component.html',
  styleUrl: './purse.component.scss',
})
export class PurseComponent implements OnInit {
  public firstBalance: string = '';
  public secondBalance: string = '';
  coinsUrls: string[] = [];
  isLoading: boolean = true;
  payinList: any[] = [];
  currentPayinIndex = 0;

  // 彈窗
  isTopUp: boolean = false;
  tradeId: string = '';
  amount: string = '';

  constructor(
    private dataService: DataService,
    private responseHandlerService: ResponseHandlerService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const account = localStorage.getItem('account');

    if (!token || !account) {
      this.isLoading = false;
      return;
    }

    const params = this.dataService.prepareParams({ token, account });
    if (token || account) {
      this.dataService
        .sendRequest('getPlayerBalance', params)
        .subscribe((response: any) => {
          const resultData =
            this.responseHandlerService.handleResponse(response);
          if (resultData) {
            this.firstBalance = resultData.firstBalance || '0';
            this.secondBalance = resultData.secondBalance || '0';
            this.payinList = resultData.payinList || [];
            // console.log('this.payinList:', this.payinList);
            if (this.payinList && this.payinList.length > 0) {
              this.isTopUp = true;
            }
            this.isLoading = false;
          }
        });
    }

    const coinUrlData = localStorage.getItem('coinsUrl');
    if (coinUrlData) {
      const parsedUrls = JSON.parse(coinUrlData);
      this.coinsUrls = parsedUrls ? [parsedUrls.first, parsedUrls.second] : [];
    }
  }

  goShopping() {
    this.router.navigate(['/shopping']);
  }
}
