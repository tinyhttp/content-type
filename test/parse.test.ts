import { suite, Test, Context } from 'uvu'
import * as assert from 'node:assert/strict'
import * as contentType from '../src/index'

const invalidTypes = [
  ' ',
  'null',
  'undefined',
  '/',
  'text / plain',
  'text/;plain',
  'text/"plain"',
  'text/p£ain',
  'text/(plain)',
  'text/@plain',
  'text/plain,wrong',
]
function describe(name: string, fn: (test: Test<Context>) => void) {
  const test = suite(name)
  fn(test)
  test.run()
}

describe('contentType.parse(string)', (it) => {
  it('should parse basic type', function () {
    const type = contentType.parse('text/html')
    assert.strictEqual(type.type, 'text/html')
  })

  it('should parse with suffix', function () {
    const type = contentType.parse('image/svg+xml')
    assert.strictEqual(type.type, 'image/svg+xml')
  })

  it('should parse basic type with surrounding OWS', function () {
    const type = contentType.parse(' text/html ')
    assert.strictEqual(type.type, 'text/html')
  })

  it('should parse parameters', function () {
    const type = contentType.parse('text/html; charset=utf-8; foo=bar')
    assert.strictEqual(type.type, 'text/html')

    assert.deepEqual(type.parameters, {
      charset: 'utf-8',
      foo: 'bar',
    })
  })

  it('should parse parameters with extra LWS', function () {
    const type = contentType.parse('text/html ; charset=utf-8 ; foo=bar')
    assert.strictEqual(type.type, 'text/html')

    assert.deepEqual(type.parameters, {
      charset: 'utf-8',
      foo: 'bar',
    })
  })

  it('should lower-case type', function () {
    const type = contentType.parse('IMAGE/SVG+XML')
    assert.strictEqual(type.type, 'image/svg+xml')
  })

  it('should lower-case parameter names', function () {
    const type = contentType.parse('text/html; Charset=UTF-8')
    assert.strictEqual(type.type, 'text/html')

    assert.deepEqual(type.parameters, {
      charset: 'UTF-8',
    })
  })

  it('should unquote parameter values', function () {
    const type = contentType.parse('text/html; charset="UTF-8"')
    assert.strictEqual(type.type, 'text/html')

    assert.deepEqual(type.parameters, {
      charset: 'UTF-8',
    })
  })

  it('should unquote parameter values with escapes', function () {
    const type = contentType.parse('text/html; charset = "UT\\F-\\\\\\"8\\""')
    assert.strictEqual(type.type, 'text/html')

    assert.deepEqual(type.parameters, {
      charset: 'UTF-\\"8"',
    })
  })

  it('should handle balanced quotes', function () {
    const type = contentType.parse(
      'text/html; param="charset=\\"utf-8\\"; foo=bar"; bar=foo'
    )
    assert.strictEqual(type.type, 'text/html')

    assert.deepEqual(type.parameters, {
      param: 'charset="utf-8"; foo=bar',
      bar: 'foo',
    })
  })

  invalidTypes.forEach((type) => {
    it('should throw on invalid media type ' + type, function () {
      assert.throws(contentType.parse.bind(null, type), /invalid media type/)
    })
  })

  it('should throw on invalid parameter format', function () {
    assert.throws(
      contentType.parse.bind(null, 'text/plain; foo="bar'),
      /invalid parameter format/
    )
    assert.throws(
      contentType.parse.bind(
        null,
        'text/plain; profile=http://localhost; foo=bar'
      ),
      /invalid parameter format/
    )
    assert.throws(
      contentType.parse.bind(null, 'text/plain; profile=http://localhost'),
      /invalid parameter format/
    )
  })

  it('should require argument', function () {
    assert.throws(contentType.parse.bind(null), /string.*required/)
  })

  it('should reject non-strings', function () {
    assert.throws(contentType.parse.bind(null, 7), /string.*required/)
  })
})

describe('contentType.parse(req)', (it) => {
  it('should parse content-type header', function () {
    const req = { headers: { 'content-type': 'text/html' } }
    const type = contentType.parse(req)
    assert.strictEqual(type.type, 'text/html')
  })

  it('should reject objects without headers property', function () {
    assert.throws(
      contentType.parse.bind(null, {}),
      /content-type header is missing/
    )
  })

  it('should reject missing content-type', function () {
    const req = { headers: {} }
    assert.throws(
      contentType.parse.bind(null, req),
      /content-type header is missing/
    )
  })
})

describe('contentType.parse(res)', (it) => {
  it('should parse content-type header', function () {
    const res = {
      getHeader: () => {
        return 'text/html'
      },
    }
    const type = contentType.parse(res)
    assert.strictEqual(type.type, 'text/html')
  })

  it('should reject objects without getHeader method', function () {
    assert.throws(
      contentType.parse.bind(null, {}),
      /content-type header is missing/
    )
  })

  it('should reject missing content-type', function () {
    const res = { getHeader: function () {} }
    assert.throws(
      contentType.parse.bind(null, res),
      /content-type header is missing/
    )
  })
})
