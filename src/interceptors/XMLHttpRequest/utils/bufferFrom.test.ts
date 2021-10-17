/**
 * @jest-environment node
 */
import { bufferFrom } from './bufferFrom'

test('returns the same Uint8Array instance as Buffer.from', () => {
  const init = 'hello world'
  const buffer = bufferFrom(init)
  const rawBuffer = Buffer.from(init)
  expect(Buffer.compare(rawBuffer, new Uint8Array(buffer))).toBe(0)
})
