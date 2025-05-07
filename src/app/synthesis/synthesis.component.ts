import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 自訂組件
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-synthesis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './synthesis.component.html',
  styleUrl: './synthesis.component.scss',
})
export class SynthesisComponent {
  isSynthesisContent: boolean = false;
  isEquipmentContent: boolean = false;
  isStrengthenContent: boolean = false;
  isBagContent: boolean = false;

  isSynthesis: boolean = false;
  isBagDetail: boolean = false;

  //存儲選中的圖片數據
  selectedBagItem: {
    id: number;
    image: string | null;
    name: string;
    category: string;
    details: string;
  } | null = null;

  // 控制bag樣式
  isBagActive: boolean = false;

  // equipmentBox
  equipmentBox: number[] = [];

  bagSpaces: {
    id: number;
    image: string | null;
    name: string;
    category: string;
    details: string;
  }[] = [];
  currentPage: number = 1;
  totalPage: number = 12;
  itemsPerPage: number = 49;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // equipment box
    this.generateEquipmentBox(5);

    // 初始化bag彈窗第一頁內容
    this.updateBagSpaces();
  }

  // 更新當前頁之內容
  updateBagSpaces() {
    this.bagSpaces = Array(this.itemsPerPage)
      .fill(0)
      .map((_, i) => ({
        id: (this.currentPage - 1) * this.itemsPerPage + i + 1,
        image: i === 0 ? 'imgs/vegetable.png' : null,
        name: i === 0 ? '巨大菠菜' : `道具${i + 1}`,
        category: i === 0 ? `食材` : `一般道具`,
        details:
          i === 0
            ? `使用後經驗值提升1200點,增加10點飢餓值,使用期間可以增加收益百分之1。`
            : `這是道具${i + 1}的描述`,
      }));
  }
  // 切換下一頁
  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.currentPage++;
      this.updateBagSpaces();
    }
  }
  // 切換上一頁
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateBagSpaces();
    }
  }

  // equipmentBox
  generateEquipmentBox(count: number): void {
    this.equipmentBox = Array.from({ length: count }, (_, i) => i + 1);
  }

  showSynthesis() {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      // this.authService.showModal('isLogin');
      this.isSynthesis = true;
      this.isSynthesisContent = true;
      this.isBagContent = true;
    } else {
      this.isSynthesis = true;
      this.isSynthesisContent = true;
      this.isBagContent = true;
    }
  }

  showEquipment() {
    this.isSynthesis = true;
    this.isSynthesisContent = false;
    this.isStrengthenContent = false;
    this.isEquipmentContent = true;
    this.isBagContent = true;
  }

  showStrengthen() {
    this.isSynthesis = true;
    this.isSynthesisContent = false;
    this.isEquipmentContent = false;
    this.isStrengthenContent = true;
    this.isBagContent = true;
  }

  showBagOnly() {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      // this.authService.showModal('isLogin');
      this.isBagActive = true;
      this.isSynthesis = true;
      this.isSynthesisContent = false;
      this.isBagContent = true;
    } else {
      this.isBagActive = true;
      this.isSynthesis = true;
      this.isSynthesisContent = false;
      this.isBagContent = true;
    }
  }

  showImgDetail(item: {
    id: number;
    image: string | null;
    name: string;
    category: string;
    details: string;
  }) {
    this.selectedBagItem = item;
    this.isBagDetail = true;
  }

  resetBagState() {
    this.isBagActive = false;
  }

  closeSynthesisModal() {
    this.isSynthesis = false;
    this.resetBagState();
  }

  closeModal() {
    this.isBagDetail = false;
    this.selectedBagItem = null;
  }
}
