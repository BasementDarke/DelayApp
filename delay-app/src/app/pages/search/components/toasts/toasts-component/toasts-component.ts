import { Component, inject } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-toasts-component',
  imports: [NgbToast],
  templateUrl: './toasts-component.html',
  styleUrl: './toasts-component.css',
  host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastsComponent {
  readonly toastService = inject(ToastService);
}
