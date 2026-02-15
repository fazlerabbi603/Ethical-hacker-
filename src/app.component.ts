
import { Component, ChangeDetectionStrategy, signal, inject, ViewChild, ElementRef, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from './services/gemini.service';
import { ScanResultsComponent, Message } from './components/scan-results.component';
import { LoaderComponent } from './components/loader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ScanResultsComponent, LoaderComponent],
})
export class AppComponent {
  private geminiService = inject(GeminiService);

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages = signal<Message[]>([]);
  userInput = signal<string>('');
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    afterNextRender(() => {
        this.scrollToBottom();
    });
  }
  
  async sendMessage(): Promise<void> {
    const userMessage = this.userInput().trim();
    if (!userMessage || this.isLoading()) {
      return;
    }

    this.error.set(null);
    this.messages.update(m => [...m, { role: 'user', content: userMessage }]);
    this.userInput.set('');
    this.isLoading.set(true);
    this.scrollToBottom();

    try {
      const response = await this.geminiService.askQuestion(userMessage);
      this.messages.update(m => [...m, { role: 'model', content: response }]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      this.error.set(errorMessage);
    } finally {
      this.isLoading.set(false);
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
        try {
            if(this.chatContainer) {
                this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
            }
        } catch(err) { }
    }, 0);
  }
}
