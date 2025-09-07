import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { PaymentStatus } from '../types/PaymentStatus';

export type PaymentCallback = (status: PaymentStatus, payload: string) => Promise<void>;

export abstract class PaymentProviderBase {
  private callbacks = new Map<string, PaymentCallback>();

  /**
   * handleWebhook return payload/status
   */
  protected abstract parseWebhook(rawBody: any): { payload: string; status: PaymentStatus } | null;

  abstract createInvoice(dto: CreateInvoiceDto, callback?: PaymentCallback): Promise<{ url: string }>;

  protected registerCallback(payload: string, callback?: PaymentCallback) {
    console.log('registerCallback', payload, callback);
    if (callback) this.callbacks.set(payload, callback);
    console.log('this.callbacks after regiester', this.callbacks);
  }

  private async callCallback(payload: string, status: PaymentStatus) {
    const callback = this.callbacks.get(payload);
    console.log('get callback from', this.callbacks, 'getted:', callback, status, payload)
    if (callback) {
      await callback(status, payload);
      this.callbacks.delete(payload);
    }
  }

  async handleWebhook(rawBody: any) {
    const result = this.parseWebhook(rawBody);
    console.log('parseWebhook result', result);
    if (result) {
      const { payload, status } = result;
      await this.callCallback(payload, status);
    }
  }
}

