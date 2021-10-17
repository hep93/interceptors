/**
 * @jest-environment jsdom
 */
import { createInterceptor } from '../../src'
import { interceptXMLHttpRequest } from '../../src/interceptors/XMLHttpRequest'
import { createXMLHttpRequest } from '../helpers'

const interceptor = createInterceptor({
  modules: [interceptXMLHttpRequest],
  resolver() {
    return {
      status: 200,
      body: (new Uint8Array([1, 2, 3])).buffer,
    }
  },
})

beforeAll(() => {
  interceptor.apply()
})

afterAll(() => {
  interceptor.restore()
})

test('supports XHR mocked response with an empty response body', async () => {
  const req = await createXMLHttpRequest((req) => {
    req.open('GET', '/arbitrary-url')
  })

  expect(req.status).toBe(200)
  console.log(req.response)
  expect(Buffer.compare(Buffer.from(new Uint8Array([1, 2, 3])), Buffer.from(req.response))).toBe(0)
})
