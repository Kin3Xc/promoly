import { createHash, randomBytes } from 'crypto'

export async function hashPassword(password: string): Promise<string> {
  return createHash('sha256').update(password).digest('hex')
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = createHash('sha256').update(password).digest('hex')
  return hash === hashedPassword
}

export function generateResetToken(): string {
  return randomBytes(32).toString('hex')
}

export function generateResetExpiry(hours: number = 1): Date {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + hours)
  return expiry
}
