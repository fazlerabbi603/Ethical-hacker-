
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService, ScanResult } from './services/gemini.service';
import { ScanResultsComponent } from './components/scan-results.component';
import { LoaderComponent } from './components/loader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ScanResultsComponent, LoaderComponent],
})
export class AppComponent {
  private geminiService = inject(GeminiService);

  targetUrl = signal<string>('https://google.com');
  scanResults = signal<ScanResult | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  loadingMessage = signal<string>('Initializing analysis...');

  async performScan(): Promise<void> {
    if (!this.targetUrl().trim()) {
      this.error.set('Please enter a valid URL.');
      return;
    }
    
    // Basic URL validation
    if (!this.isValidHttpUrl(this.targetUrl())) {
      this.error.set('Invalid URL. Please ensure it starts with http:// or https://');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.scanResults.set(null);

    try {
      this.loadingMessage.set('Agent is analyzing target...');
      const results = await this.geminiService.analyzeUrl(this.targetUrl());
      this.scanResults.set(results);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during the scan.';
      this.error.set(`Analysis failed: ${errorMessage}`);
    } finally {
      this.isLoading.set(false);
    }
  }

  private isValidHttpUrl(str: string): boolean {
    let url;
    try {
      url = new URL(str);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }
}
