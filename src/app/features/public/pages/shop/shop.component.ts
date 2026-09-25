import { CommonModule } from '@angular/common';
import { Component, computed, inject, Injectable, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

export interface ShopProduct { id: string; name: string; category: string; description: string; price: number; unit: string; image: string; badge?: string; }
export interface ShopCartItem extends ShopProduct { quantity: number; }
export const SHOP_PRODUCTS: ShopProduct[] = [
	{ id: 'jambo101-spawn', name: 'JAMBO101 Spawn', category: 'Biological inputs', description: 'A high-yield strain developed by Mush& for local climate resilience and rapid fruiting.', price: 850, unit: '1 kg bag', image: '/images/smartmushrooms/jambo.jpeg', badge: 'Best seller' },
	{ id: 'jambo101-temperature-stable', name: 'JAMBO101 Temperature-Stable Spawn', category: 'Biological inputs', description: 'A temperature-stable strain for small-scale and peri-urban growers.', price: 950, unit: '1 kg bag', image: '/images/smartmushrooms/JAMBO101 Temperature-Stable Spawn.jpeg' },
	{ id: 'mambo101-spawn', name: 'MAMBO101 Spawn', category: 'Biological inputs', description: 'A reliable mushroom strain selected for accessible African growing conditions.', price: 850, unit: '1 kg bag', image: '/images/smartmushrooms/mambo.jpeg', badge: 'New strain' },
	{ id: 'fresh-mushroom-punnets', name: 'Fresh Mushroom Punnets', category: 'Fresh produce', description: 'Hand-picked Oyster and Button mushrooms packed in eco-friendly punnets.', price: 450, unit: '250 g punnet', image: '/images/smartmushrooms/punnets.jpeg', badge: 'Fresh today' },
	{ id: 'mushroom-wine', name: 'Mushroom Wine', category: 'Value-added', description: 'An artisanal fermented specialty wine produced at JKUAT laboratories.', price: 1200, unit: '750 ml bottle', image: '/images/smartmushrooms/mushwine.jpeg' },
	{ id: 'pumice-house-iot-kit', name: 'Pumice House + IoT Kit', category: 'Agritech hardware', description: 'A complete off-grid package with pumice wall layout, LoRaWAN sensor array, solar unit, foggers, and fans.', price: 48000, unit: 'installation kit', image: '/images/smartmushrooms/iott.jpeg', badge: 'Grow smarter' }
];

@Injectable({ providedIn: 'root' })
export class ShopCartService {
	readonly cart = signal<ShopCartItem[]>([]);
	readonly cartCount = computed(() => this.cart().reduce((total, item) => total + item.quantity, 0));
	readonly cartTotal = computed(() => this.cart().reduce((total, item) => total + item.price * item.quantity, 0));
	add(product: ShopProduct): void { this.cart.update(items => { const existing = items.find(item => item.id === product.id); return existing ? items.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }]; }); }
	buyNow(product: ShopProduct): void { this.cart.set([{ ...product, quantity: 1 }]); }
	changeQuantity(productId: string, change: number): void { this.cart.update(items => items.map(item => item.id === productId ? { ...item, quantity: item.quantity + change } : item).filter(item => item.quantity > 0)); }
	remove(productId: string): void { this.cart.update(items => items.filter(item => item.id !== productId)); }
	clear(): void { this.cart.set([]); }
}

type DeliveryOption = 'pickup' | 'courier';

@Component({
	selector: 'app-shop',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './shop.component.html',
	styleUrl: './shop.component.css'
})
export class ShopComponent {
	private readonly api = inject(ApiService);
	private readonly formBuilder = inject(FormBuilder);
	private readonly cartService = inject(ShopCartService);

	readonly products: ShopProduct[] = SHOP_PRODUCTS;

	readonly cart = this.cartService.cart;
	readonly drawerOpen = signal(false);
	readonly submitting = signal(false);
	readonly submitted = signal(false);
	readonly checkoutError = signal('');
	readonly cartCount = this.cartService.cartCount;
	readonly cartTotal = this.cartService.cartTotal;

	readonly checkoutForm = this.formBuilder.nonNullable.group({
		fullName: ['', [Validators.required, Validators.minLength(2)]],
		phoneNumber: ['', [Validators.required, Validators.pattern(/^(?:\+254|0)\d{9}$/)]],
		deliveryOption: ['pickup' as DeliveryOption, Validators.required]
	});

	constructor(route: ActivatedRoute) {
		route.queryParamMap.subscribe(params => {
			if (params.get('bag') === 'open') this.openDrawer();
		});
	}

	addToCart(product: ShopProduct): void {
		this.cartService.add(product);
		this.openDrawer();
	}

	buyNow(product: ShopProduct): void {
		this.cartService.buyNow(product);
		this.openDrawer();
	}

	changeQuantity(productId: string, change: number): void {
		this.cartService.changeQuantity(productId, change);
	}

	removeFromCart(productId: string): void {
		this.cartService.remove(productId);
	}

	openDrawer(): void {
		this.submitted.set(false);
		this.checkoutError.set('');
		this.drawerOpen.set(true);
	}

	closeDrawer(): void {
		if (!this.submitting()) this.drawerOpen.set(false);
	}

	submitOrder(): void {
		if (this.checkoutForm.invalid || this.cart().length === 0) {
			this.checkoutForm.markAllAsTouched();
			return;
		}

		this.submitting.set(true);
		this.checkoutError.set('');
		const value = this.checkoutForm.getRawValue();
		this.api.post('/shop', {
			full_name: value.fullName.trim(),
			phone_number: value.phoneNumber.trim(),
			delivery_option: value.deliveryOption,
			items: this.cart().map(item => ({ product_id: item.id, product_name: item.name, quantity: item.quantity, unit_price: item.price })),
			total_amount: this.cartTotal()
		}).subscribe({
			next: () => {
				this.submitting.set(false);
				this.submitted.set(true);
				this.cartService.clear();
				this.checkoutForm.reset({ fullName: '', phoneNumber: '', deliveryOption: 'pickup' });
			},
			error: () => {
				this.submitting.set(false);
				this.checkoutError.set('We could not send your request. Please try again.');
			}
		});
	}
}
