import { timingSafeEqual } from "node:crypto";
import { base32ToBuf, hmacDigest, pad, uintToBuf } from "./utils";

interface IConfig {
    secret: string;
    algorithm?: string;
    digits?: number;
    counter?: number;
}

interface IGenerateParam {
    counter?: number;
}

interface IInvalidateParam {
    token: string;
    counter?: number;
    window?: number;
}

/**
 * HOTP: An HMAC-based One-time Password Algorithm.
 * @see [RFC 4226](https://tools.ietf.org/html/rfc4226)
 * @see [otpauth](https://github.com/hectorm/otpauth)
 */
export class HOTP {
    private readonly secret: string;
    private readonly algorithm: string = "SHA1";
    private readonly digits: number = 6;
    private counter = 0;

    /**
     * Creates an HOTP object.
     * @param {Object} [config] Configuration options.
     * @param {string} [config.secret] Secret key.base32 string
     * @param {string} [config.algorithm='SHA1'] HMAC hashing algorithm.
     * @param {number} [config.digits=6] Token length.
     * @param {number} [config.counter=0] Initial counter value.
     */
    public constructor({ secret, algorithm = "SHA1", digits = 6, counter = 0 }: IConfig) {
        this.secret = secret;
        this.algorithm = algorithm;
        this.digits = digits;
        this.counter = counter;
    }
    /**
     * Generates an HOTP token.
     * @param {number} [counter=0] Counter value.
     * @returns {string} Token.
     */
    public generate({ counter = this.counter++ }: IGenerateParam = {}): string {
        const digest = new Uint8Array(hmacDigest(this.algorithm, base32ToBuf(this.secret), uintToBuf(counter)));
        const offset = digest[digest.byteLength - 1] & 15;
        const otp =
            (((digest[offset] & 127) << 24) |
                ((digest[offset + 1] & 255) << 16) |
                ((digest[offset + 2] & 255) << 8) |
                (digest[offset + 3] & 255)) %
            10 ** this.digits;

        return pad(otp, this.digits);
    }
    /**
     * Validates an HOTP token.
     * @param {Object} [config] Configuration options.
     * @param {string} [config.token] Token value.
     * @param {number} [config.counter] Counter value.
     * @param {number} [config.window = 1] Window of counter values to test.
     * @returns {number|null} Token delta or null if it is not found in the search window, in which case it should be considered invalid.
     */
    public validate({ token, counter = this.counter, window = 1 }: IInvalidateParam): number | null {
        // Return early if the token length does not match the digit number.
        if (token.length !== this.digits) return null;

        let delta = null;
        for (let i = counter - window; i <= counter + window; ++i) {
            const generatedToken = this.generate({ counter: i });
            if (timingSafeEqual(Buffer.from(token), Buffer.from(generatedToken))) {
                delta = i - counter;
            }
        }
        return delta;
    }
}
