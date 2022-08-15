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
    // Secret key.base32 string
    private readonly secret: string;
    // HMAC hashing algorithm
    // openssl list -digest-algorithms
    private readonly algorithm: string = "SHA256";
    // Token length
    private readonly digits: number = 6;
    // Initial counter value.
    private counter = 0;

    /**
     * Creates an HOTP object.
     * @param {Object} [config] Configuration options.
     * @param {string} [config.secret] Secret key.base32 string
     * @param {string} [config.algorithm='SHA256'] HMAC hashing algorithm.
     * @param {number} [config.digits=6] Token length.
     * @param {number} [config.counter=0] Initial counter value.
     */
    public constructor({ secret, algorithm = "SHA256", digits = 6, counter = 0 }: IConfig) {
        this.secret = secret;
        this.algorithm = algorithm;
        this.digits = digits;
        this.counter = counter;
    }
    /**
     * Generates an HOTP token.
     * Generate a counter-based one-time token. Specify the counter, and receive
     * the one-time password for that counter position as a string.
     *
     * @param {number} [counter=0] Counter value.
     * @returns {string} Token.
     */
    public generate({ counter = this.counter++ }: IGenerateParam = {}): string {
        const digest = new Uint8Array(hmacDigest(this.algorithm, base32ToBuf(this.secret), uintToBuf(counter)));
        // 计算 HOTP 偏移
        const offset = digest[digest.byteLength - 1] & 15;
        // 计算二进制代码（RFC4226 5.4）
        const otp =
            (((digest[offset] & 127) << 24) |
                ((digest[offset + 1] & 255) << 16) |
                ((digest[offset + 2] & 255) << 8) |
                (digest[offset + 3] & 255)) %
            10 ** this.digits;

        // left-pad code
        return pad(otp, this.digits);
    }
    /**
     * Validates an HOTP token.
     * Verify a counter-based one-time token against the secret and return the delta.
     * 验证基于计数器的一次性令牌 `token`，并返回增量 `delta` 返回 nul没有找到或0 正负数（表示找到的位置）
     * 默认情况下，它以给定的计数器值 `counter` 验证令牌 `token`，没有余量（超前或滞后）
     * 在当前计数器值处验证的令牌的增量为 0
     *
     * 可以设置 `window` 值来增加余量
     *
     * 返回令牌的计数器值与给定计数器值之间的差值。例如，如果给定计数器counter=5和window=10，
     * 将检查从 5 到 15（含）的令牌，如果在计数器位置 7 找到它，它将返回 delta=2
     *
     * @param {Object} [config] Configuration options.
     * @param {string} [config.token] Token value.
     * @param {number} [config.counter] Counter value.
     * @param {number} [config.window = 0] Window of counter values to test.
     *  Window 为计数器的允许余量，如果给定计数器counter=5和window=10
     *  将检查从 5 到 15（含）的令牌
     * @returns {number|null} Token delta or null if it is not found in the search window, in which case it should be considered invalid.
     */
    public validate({ token, counter = this.counter, window = 0 }: IInvalidateParam): number | null {
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
