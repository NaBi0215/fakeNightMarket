import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-massange',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './massange.component.html',
  styleUrl: './massange.component.scss',
})
export class MassangeComponent {
  isExpanded: boolean = false;
  triggerBounce: boolean = false;
  isNewMassange: boolean = true;
  isInnerNewMassange: boolean = true;

  // 對話框
  isDialog: boolean = false;
  dialogPosition = { x: 0, y: 0 };
  // 紀錄當前點擊的.playerPic
  currentPlayerPic: HTMLElement | null = null;

  toggleContainer() {
    this.triggerBounce = true;
    this.isNewMassange = false;
    this.isExpanded = !this.isExpanded;

    // 當主容器關閉時 同時關閉dialog
    if (!this.isExpanded) {
      this.closeDialog();
    }
  }

  toggleDialog(event: MouseEvent, content: string) {
    const clickedElement = event.target as HTMLElement;

    // 如果當前點擊的是同一個元素 則關閉dialog
    if (this.currentPlayerPic === clickedElement && this.isDialog) {
      this.closeDialog();
      this.isInnerNewMassange = false;
    } else {
      // 顯示dialog
      const rect = clickedElement.getBoundingClientRect();
      this.isDialog = true;

      // 設置dialog位置
      this.dialogPosition = {
        x: rect.right + 30,
        y: rect.top + rect.height / 2 - 10,
      };

      // 更新當前點擊元素
      this.currentPlayerPic = clickedElement;
    }
  }

  closeDialog() {
    this.isDialog = false;
    this.currentPlayerPic = null;
  }
}
