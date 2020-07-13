# es-content-type

[![Twitter](https://img.shields.io/twitter/follow/v1rtl.svg?label=twitter&style=flat-square)](https://twitter.com/v1rtl)
![Top lang](https://img.shields.io/github/languages/top/talentlessguy/es-content-type.svg?style=flat-square)
![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/es-content-type.svg?style=flat-square)
[![Version](https://img.shields.io/npm/v/es-content-type.svg?style=flat-square)](https://npm.im/es-content-type)
![Last commit](https://img.shields.io/github/last-commit/talentlessguy/es-content-type.svg?style=flat-square)

> [`content-type`](https://github.com/jshttp/content-type) rewrite in TypeScript with ESM and CommonJS targets.

Create and parse HTTP Content-Type header according to RFC 7231

## Install

```sh
pnpm i es-content-type
```

## API

```ts
import { parse, format } from 'es-content-type'
```

### `parse(string: string | Request | Response)`

```ts
const obj = parse('image/svg+xml; charset=utf-8')
```

Parse a `Content-Type` header. This will return an object with the following
properties (examples are shown for the string `'image/svg+xml; charset=utf-8'`):

- `type`: The media type (the type and subtype, always lower case).
  Example: `'image/svg+xml'`

- `parameters`: An object of the parameters in the media type (name of parameter
  always lower case). Example: `{charset: 'utf-8'}`

Throws a `TypeError` if the string is missing or invalid.

```ts
const obj = contentType.parse(req)
```

Parse the `Content-Type` header from the given `req`. Short-cut for
`contentType.parse(req.headers['content-type'])`.

Throws a `TypeError` if the `Content-Type` header is missing or invalid.

```js
const obj = contentType.parse(res)
```

Parse the `Content-Type` header set on the given `res`. Short-cut for
`contentType.parse(res.getHeader('content-type'))`.

Throws a `TypeError` if the `Content-Type` header is missing or invalid.

### `format(obj)`

```ts
const str = contentType.format({
  type: 'image/svg+xml',
  parameters: { charset: 'utf-8' },
})
```

Format an object into a `Content-Type` header. This will return a string of the
content type for the given object with the following properties (examples are
shown that produce the string `'image/svg+xml; charset=utf-8'`):

- `type`: The media type (will be lower-cased). Example: `'image/svg+xml'`

- `parameters`: An object of the parameters in the media type (name of the
  parameter will be lower-cased). Example: `{charset: 'utf-8'}`

Throws a `TypeError` if the object contains an invalid type or parameter names.

## License

MIT © [v1rtl](https://v1rtl.site)
