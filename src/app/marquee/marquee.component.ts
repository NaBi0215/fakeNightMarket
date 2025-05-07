import { Component, OnInit, OnDestroy, Input } from '@angular/core';
// 自訂組件
import { MarqueeService } from '../marquee.service';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [],
  templateUrl: './marquee.component.html',
  styleUrl: './marquee.component.scss',
})
export class MarqueeComponent implements OnInit, OnDestroy {
  @Input() marginTop: string = '0px';

  fullMessage: string = '';

  constructor(private marqueeService: MarqueeService) {}

  ngOnInit(): void {
    this.marqueeService.fetchMessages();

    this.marqueeService.fullMessage$.subscribe((message) => {
      this.fullMessage = message;
    });
  }

  ngOnDestroy(): void {
    // 當離開組件時保存當前索引
    const currentIndex = this.marqueeService.getCurrentIndex();
    // 循環更新索引
    const nextIndex = (currentIndex + 1) % this.marqueeService.messages.length;
    this.marqueeService.setCurrentIndex(nextIndex);
  }
}
