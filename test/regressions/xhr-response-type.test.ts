/**
 * @jest-environment jsdom
 */
import { createInterceptor } from '../../src'
import { interceptXMLHttpRequest } from '../../src/interceptors/XMLHttpRequest'
import { createXMLHttpRequest, readBlob } from '../helpers'

const interceptor = createInterceptor({
  modules: [interceptXMLHttpRequest],
  resolver() {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Maverick',
      }),
    }
  },
})

beforeAll(() => {
  interceptor.apply()
})

afterAll(() => {
  interceptor.restore()
})

test('responds with an object when "responseType" equals "json"', async () => {
  const req = await createXMLHttpRequest((req) => {
    req.open('GET', '/arbitrary-url')
    req.responseType = 'json'
  })

  expect(typeof req.response).toBe('object')
  expect(req.response).toEqual({
    firstName: 'John',
    lastName: 'Maverick',
  })
})

test('responds with a Blob when "responseType" equals "blob"', async () => {
  const req = await createXMLHttpRequest((req) => {
    req.open('GET', '/arbitrary-url')
    req.responseType = 'blob'
  })

  const expectedBlob = new Blob(
    [
      JSON.stringify({
        firstName: 'John',
        lastName: 'Maverick',
      }),
    ],
    {
      type: 'application/json',
    }
  )

  const responseBlob: Blob = req.response
  const expectedBlobContents = await readBlob(responseBlob)

  expect(responseBlob).toBeInstanceOf(Blob)
  // Blob type must be inferred from the response's "Content-Type".
  expect(responseBlob).toHaveProperty('type', 'application/json')
  expect(responseBlob).toHaveProperty('size', expectedBlob.size)
  expect(expectedBlobContents).toEqual(
    JSON.stringify({
      firstName: 'John',
      lastName: 'Maverick',
    })
  )
})

test('responds with an ArrayBuffer when "responseType" equals "arraybuffer"', async () => {
  const req = await createXMLHttpRequest((req) => {
    req.open('GET', '/arbitrary-url')
    req.responseType = 'arraybuffer'
  })

  const expectedArrayBuffer = 
    Buffer.from(
      JSON.stringify({
        firstName: 'John',
        lastName: 'Maverick',
      })
    )

  const responseBuffer: ArrayBuffer = req.response

  expect(Buffer.compare(Buffer.from(responseBuffer), expectedArrayBuffer)).toBe(0)
})
