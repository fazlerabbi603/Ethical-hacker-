
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="flex items-start gap-4 py-4">
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-800 flex items-center justify-center border-2 border-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div class="max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
        <div class="flex items-center gap-2 h-6">
          <span class="typing-dot"></span>
          <span class="typing-dot" style="animation-delay: 0.2s;"></span>
          <span class="typing-dot" style="animation-delay: 0.4s;"></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .typing-dot {
      width: 8px;
      height: 8px;
      background-color: #9ca3af; /* gray-400 */
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
      } 40% {
        transform: scale(1.0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {}
