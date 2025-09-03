import { CreateInvoiceDto } from '../dto/create-invoice.dto';

export type PaymentCallback = (status: 'paid' | 'cancelled' | 'failed', payload: string) => Promise<void>;

export abstract class PaymentProviderBase {
  private callbacks = new Map<string, PaymentCallback>();

  abstract createInvoice(dto: CreateInvoiceDto, callback?: PaymentCallback): Promise<{ url: string }>;

  protected registerCallback(payload: string, callback: PaymentCallback) {
    if (callback) this.callbacks.set(payload, callback);
  }

  async handlePayment(payload: string, status: 'paid' | 'cancelled' | 'failed') {
    const callback = this.callbacks.get(payload);
    if (callback) {
      await callback(status, payload);
      this.callbacks.delete(payload);
    }
  }
}


