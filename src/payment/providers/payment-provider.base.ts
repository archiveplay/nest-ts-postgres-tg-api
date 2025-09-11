import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { PaymentStatus } from '../types/PaymentStatus';

export type PaymentCallback = (
  status: PaymentStatus
) => Promise<void>;

export interface ParsedPaymentPayload {
  currency: string;
  amount: number;
}

export abstract class PaymentProviderBase {
  private callbacks = new Map<
    string,
    PaymentCallback
  >();

  /**
   * handleWebhook return payload/status
   */
  protected abstract parseWebhook(rawBody: any): {
    payload: ParsedPaymentPayload;
    status: PaymentStatus;
  } | null;

  abstract createInvoice(
    dto: CreateInvoiceDto,
    callback?: PaymentCallback
  ): Promise<{ url: string }>;

  protected registerCallback(
    status: PaymentStatus,
    callback?: PaymentCallback
  ) {
    if (callback)
      this.callbacks.set(status, callback);
  }

  private async callCallback(
    status: PaymentStatus
  ) {
    const callback = this.callbacks.get(status);
    if (callback) {
      await callback(status);
      this.callbacks.delete(status);
    }
  }

  async handleWebhook(rawBody: any) {
    const result = this.parseWebhook(rawBody);
    console.log('parseWebhook result', result);
    if (result) {
      const { status } = result;
      await this.callCallback(status);
    }
  }
}
