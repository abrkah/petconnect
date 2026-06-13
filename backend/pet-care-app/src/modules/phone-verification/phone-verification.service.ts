import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

type PendingCode = {
  code: string;
  expiresAt: number;
  verified: boolean;
};

@Injectable()
export class PhoneVerificationService {
  /** phone -> pending verification */
  private readonly store = new Map<string, PendingCode>();

  normalizePhone(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      throw new BadRequestException('Phone number is required');
    }

    let national = digits;
    if (national.startsWith('43')) {
      national = national.slice(2);
    } else if (national.startsWith('0')) {
      national = national.slice(1);
    }

    if (national.length < 4 || national.length > 12) {
      throw new BadRequestException('Enter a valid Austrian phone number');
    }

    return `+43${national}`;
  }

  sendCode(rawPhone: string): { phoneNumber: string; devCode?: string } {
    const phoneNumber = this.normalizePhone(rawPhone);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    this.store.set(phoneNumber, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
      verified: false,
    });

    // In production, integrate Twilio or similar. Log for local/dev use.
    console.log(`[SMS] Verification code for ${phoneNumber}: ${code}`);

    const result: { phoneNumber: string; devCode?: string } = { phoneNumber };
    if (process.env.NODE_ENV !== 'production') {
      result.devCode = code;
    }
    return result;
  }

  verifyCode(rawPhone: string, code: string): { phoneNumber: string } {
    const phoneNumber = this.normalizePhone(rawPhone);
    const entry = this.store.get(phoneNumber);
    if (!entry) {
      throw new UnauthorizedException('No verification code sent for this number');
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(phoneNumber);
      throw new UnauthorizedException('Verification code expired — request a new one');
    }
    if (entry.code !== code.trim()) {
      throw new UnauthorizedException('Invalid verification code');
    }
    entry.verified = true;
    return { phoneNumber };
  }

  assertVerified(rawPhone: string): string {
    const phoneNumber = this.normalizePhone(rawPhone);
    const entry = this.store.get(phoneNumber);
    if (!entry?.verified || Date.now() > entry.expiresAt) {
      throw new BadRequestException('Phone number is not verified');
    }
    this.store.delete(phoneNumber);
    return phoneNumber;
  }
}
