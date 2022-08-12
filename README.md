# OTPAuth

One Time Password (HOTP/TOTP) library for Node.js

Reference [otpauth](https://github.com/hectorm/otpauth)

## Usage

### Node.js

```javascript
import { HOTP, TOTP } from "../src";
// Create a new TOTP object.
let totp = new TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: "NB2W45DFOIZA",
});
// Generate a token.
let token = totp.generate();
// Validate a token.
let delta = totp.validate({
    token: token,
    window: 1,
});
```

## Supported hashing algorithms

In Node.js, the same algorithms as
[`Crypto.createHmac`](https://nodejs.org/api/crypto.html#crypto_crypto_createhmac_algorithm_key_options)
function are supported, since it is used internally.

## License

[MIT License](https://github.com/hectorm/otpauth/blob/master/LICENSE.md)
© [Héctor Molinero Fernández](https://hector.molinero.dev/).
