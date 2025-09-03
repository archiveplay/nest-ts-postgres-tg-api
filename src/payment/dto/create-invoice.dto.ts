import { IsString, IsNumber, IsEnum } from 'class-validator';
import { PaymentProviderType } from '../providers/payment-provider.enum';

export class CreateInvoiceDto {
  @IsEnum(PaymentProviderType)
  provider: PaymentProviderType;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  payload: string;

  @IsNumber()
  amount: number;
}

