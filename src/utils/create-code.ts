import { randomUUID } from 'crypto'

export function createCode() {
  return randomUUID()
}
