import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-red-envelope',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './red-envelope.component.html',
  styleUrl: './red-envelope.component.scss',
})
export class RedEnvelopeComponent {
  showImg: boolean = true;

  removeImg(): void {
    this.showImg = false;
  }
}
