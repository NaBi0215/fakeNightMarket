import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// 自訂組件
import { DataService } from '../../data.service';
import { ResponseHandlerService } from '../../response-handler.service';
// UI組件
import { HeaderComponent } from '../../header/header.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { MarqueeComponent } from '../../marquee/marquee.component';
import { PurseComponent } from '../../purse/purse.component';
import { CopyrightComponent } from '../../copyright/copyright.component';
import { EventListComponent } from '../../event-list/event-list.component';
import { response } from 'express';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    HeaderComponent,
    NavBarComponent,
    MarqueeComponent,
    PurseComponent,
    CopyrightComponent,
    CommonModule,
    EventListComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent implements OnInit {
  taskList: any[] = [];
  recordList: any[] = [];
  selectedTask: any = null;
  selectedGiftNames: string = '';
  btns: string[] = ['新手任務', '日常任務', '成就任務', '活動任務'];
  selectedBtn: string = '';
  // 動畫尚未使用完全
  isFading: boolean = false;

  isModalVisible: { [key: string]: boolean } = {
    isTaskGet: false,
  };

  constructor(
    private dataService: DataService,
    private responseHandlerService: ResponseHandlerService
  ) {}

  ngOnInit(): void {
    this.fetchTask('0');
    this.fetchTaskRecord();
  }

  fetchTask(type: string): void {
    this.selectedBtn = this.btns[parseInt(type)];
    const token = localStorage.getItem('token');
    const startRow = '1';
    const batchRow = '4';
    const params = this.dataService.prepareParams({
      token,
      type,
      startRow,
      batchRow,
    });
    this.dataService
      .sendRequest('getTaskList', params)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          this.taskList = resultData.taskList;
          // 測試用 若為不可領取狀態
          // taskList.forEach((task: any) => {
          //   task.receive = '1';
          // });
        }
      });
  }

  fetchTaskGet(task: any): void {
    if (task.receive === '2') {
      return;
    }

    const token = localStorage.getItem('token');
    const taskId = task.taskId;
    const params = this.dataService.prepareParams({
      token,
      taskId,
    });

    this.dataService
      .sendRequest('receiveTaskGift', params)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          task.receive = '2';
          this.taskList = [...this.taskList];
          this.showModal('isTaskGet', task);
        }
      });
  }

  getBtnClass(task: any) {
    return {
      active: task.receive === '0',
      disabled: task.receive === '1',
      received: task.receive === '2',
    };
  }

  showModal(modalKey: string, task?: { giftList: { itemName: string }[] }) {
    this.isModalVisible[modalKey] = true;
    if (task) {
      this.selectedTask = task;
      this.selectedGiftNames = task.giftList
        .map((gift) => gift.itemName)
        .join(' ');
    }
  }

  closeModal(modalKey: string) {
    this.isModalVisible[modalKey] = false;
    this.selectedTask = null;
    this.selectedGiftNames = '';
  }

  // changeTask(btnName: string): void {
  //   this.isFading = true;
  //   setTimeout(() => {
  //     this.selectedBtn = btnName;
  //     // this.taskList = this.taskList[btnName];
  //     this.isFading = false;
  //   }, 500);
  // }

  fetchTaskRecord(): void {
    const token = localStorage.getItem('token');
    const startRow = '1';
    const batchRow = '4';
    const params = this.dataService.prepareParams({
      token,
      startRow,
      batchRow,
    });
    this.dataService
      .sendRequest('getTaskRecord', params)
      .subscribe((response: any) => {
        const resultData = this.responseHandlerService.handleResponse(response);
        if (resultData) {
          this.recordList = resultData.recordList;
          console.log(this.recordList);
        }
      });
  }
}
