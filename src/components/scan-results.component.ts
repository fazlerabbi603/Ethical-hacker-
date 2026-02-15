
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Message {
  role: 'user' | 'model';
  content: string;
}

@Component({
  selector: 'app-scan-results',
  templateUrl: './scan-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ScanResultsComponent {
  message = input.required<Message>();
}
