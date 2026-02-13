
import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanResult, Vulnerability } from '../services/gemini.service';

type ActiveTab = 'summary' | 'vulnerabilities' | 'ports' | 'headers';

@Component({
  selector: 'app-scan-results',
  templateUrl: './scan-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ScanResultsComponent {
  results = input.required<ScanResult>();
  activeTab = signal<ActiveTab>('summary');

  setActiveTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
  }

  getSeverityClass(severity: Vulnerability['severity']): string {
    switch (severity) {
      case 'Critical':
        return 'border-red-500 bg-red-900/20';
      case 'High':
        return 'border-orange-500 bg-orange-900/20';
      case 'Medium':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'Low':
        return 'border-blue-500 bg-blue-900/20';
      default:
        return 'border-gray-600 bg-gray-800/20';
    }
  }

  getSeverityTextClass(severity: Vulnerability['severity']): string {
    switch (severity) {
        case 'Critical': return 'text-red-400';
        case 'High': return 'text-orange-400';
        case 'Medium': return 'text-yellow-400';
        case 'Low': return 'text-blue-400';
        default: return 'text-gray-400';
    }
  }
}
