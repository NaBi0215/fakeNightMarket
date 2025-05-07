import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
// 自訂組件
import { DataService } from './data.service';
import { ResponseHandlerService } from './response-handler.service';

@Injectable({
  providedIn: 'root',
})
export class MarqueeService {
  // 保存從後端獲取的訊息
  public messages: string[] = [];
  // 當前顯示的訊息索引
  private currentIndex = 0;
  private fullMessageSubject = new BehaviorSubject<string>('');
  fullMessage$ = this.fullMessageSubject.asObservable();
  private fetchSubscription: Subscription | null = null;
  constructor(
    private dataService: DataService,
    private responseHandlerService: ResponseHandlerService
  ) {}

  fetchMessages(): void {
    if (this.fetchSubscription) {
      return;
    }

    // 先立即調用一次
    this.dataService.sendRequest('getMarqueeList').subscribe((response) => {
      const resultData = this.responseHandlerService.handleResponse(response);
      if (resultData?.list) {
        this.messages = resultData.list;
        this.updateFullMessage();
      }
    });

    this.fetchSubscription = interval(10000)
      .pipe(
        switchMap(() => this.dataService.sendRequest('getMarqueeList')),
        shareReplay(1)
      )
      .subscribe({
        next: (response: any) => {
          const resultData =
            this.responseHandlerService.handleResponse(response);
          if (resultData?.list) {
            this.messages = resultData.list;
            this.updateFullMessage();
          }
        },
      });
  }

  private updateFullMessage() {
    // 從當前索引開始拚接訊息
    const fullMessage = this.messages
      .slice(this.currentIndex)
      // 確保訊息循環
      .concat(this.messages.slice(0, this.currentIndex))
      .join('          ');
    this.fullMessageSubject.next(fullMessage);
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  setCurrentIndex(index: number) {
    this.currentIndex = index;
    this.updateFullMessage();
  }
}
