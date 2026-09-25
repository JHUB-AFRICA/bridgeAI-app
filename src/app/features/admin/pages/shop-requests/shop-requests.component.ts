import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

interface ShopRequestItem { product_name: string; quantity: number; unit_price: number; }
interface ShopRequest { id: number; full_name: string; phone_number: string; delivery_option: 'pickup' | 'courier'; items: ShopRequestItem[]; total_amount: number; status: string; submitted_at: string; }

@Component({
	selector: 'app-shop-requests',
	imports: [CommonModule],
	templateUrl: './shop-requests.component.html',
	styleUrl: './shop-requests.component.css'
})
export class ShopRequestsComponent {
	private readonly api = inject(ApiService);
	private readonly notificationService = inject(NotificationService);
	readonly requests = signal<ShopRequest[]>([]);
	readonly loading = signal(true);
	readonly updatingId = signal<number | null>(null);
	readonly statuses = ['pending', 'confirmed', 'fulfilled', 'cancelled'];

	constructor() { this.loadRequests(); }

	loadRequests(): void {
		this.loading.set(true);
		this.api.get<ShopRequest[]>('/shop').subscribe({ next: requests => { this.requests.set(requests); this.loading.set(false); }, error: () => this.loading.set(false) });
	}

	updateStatus(item: ShopRequest, status: string): void {
		this.updatingId.set(item.id);
		this.api.patch<ShopRequest>(`/shop/${item.id}`, { status }).subscribe({ next: updated => { this.requests.update(items => items.map(request => request.id === item.id ? updated : request)); this.updatingId.set(null); }, error: () => this.updatingId.set(null) });
	}

	deleteRequest(item: ShopRequest): void {
		if (!window.confirm(`Delete the request from ${item.full_name}?`)) return;
		this.updatingId.set(item.id);
		this.api.delete(`/shop/${item.id}`).subscribe({ next: () => { this.requests.update(items => items.filter(request => request.id !== item.id)); this.updatingId.set(null); this.notificationService.showSuccess('Shop request deleted successfully'); }, error: () => this.updatingId.set(null) });
	}

	itemSummary(item: ShopRequest): string { return item.items.map(orderItem => `${orderItem.product_name} x${orderItem.quantity}`).join(', '); }
	deliveryLabel(option: ShopRequest['delivery_option']): string { return option === 'pickup' ? 'JKUAT pickup' : 'County courier'; }
}
