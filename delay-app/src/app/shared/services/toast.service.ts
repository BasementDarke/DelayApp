import { Injectable, signal } from '@angular/core';

export interface Toast {
	message?: string;
	classname?: string;
	delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
	private readonly _toasts = signal<Toast[]>([]);
	readonly toasts = this._toasts.asReadonly();

	showError(message: string){
		let t = {message, classname:"bg-danger text-light", delay: 5000}
		this._toasts.update((toasts) => [...toasts, t]);
	}

	showSuccess(message: string){
		let t = {message, classname:"bg-success text-light", delay: 5000}
		this._toasts.update((toasts) => [...toasts, t]);
	}

	remove(toast: Toast) {
		this._toasts.update((toasts) => toasts.filter((t) => t !== toast));
	}

	clear() {
		this._toasts.set([]);
	}
}
