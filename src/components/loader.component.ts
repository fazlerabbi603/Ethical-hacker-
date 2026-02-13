
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="flex flex-col items-center justify-center p-8 bg-gray-800/50 border border-gray-700 rounded-lg">
      <div class="loader"></div>
      <p class="text-green-300 mt-4 text-lg">{{ message() }}</p>
    </div>
  `,
  styles: [`
    .loader {
      border: 4px solid #374151; /* bg-gray-700 */
      border-top: 4px solid #34d399; /* emerald-400, close to green-400 */
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  message = input<string>('Loading...');
}
