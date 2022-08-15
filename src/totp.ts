import { HOTP } from "./hotp";

interface IConfig {
    secret: string;
    algorithm?: string;
    digits?: number;
    period?: number;
}

interface IGenerateParam {
    timestamp?: number;
}

interface IInvalidateParam {
    token: string;
    timestamp?: number;
    window?: number;
}

/**
 * One Time Password (HOTP/TOTP) library for Node.js
 * TOTP: Time-Based One-Time Password Algorithm.
 * @see [RFC 6238](https://tools.ietf.org/html/rfc6238)
 * @see [otpauth](https://github.com/hectorm/otpauth)
 */
export class TOTP {
    // Secret key.base32 string
    private readonly secret: string;
    // HMAC hashing algorithm
    // openssl list -digest-algorithms
    private readonly algorithm: string = "SHA256";
    // Token length
    private readonly digits: number = 6;
    // Token time-step duration 时间步长，表示每隔几秒产生一个新令牌
    private readonly period: number = 30;
    private readonly hotp: HOTP;

    /**
     * Creates a TOTP object.
     * @param {Object} [config] Configuration options.
     * @param {Secret|string} [config.secret] secret key.base32 string
     * @param {string} [config.algorithm='SHA256'] HMAC hashing algorithm.
     * @param {number} [config.digits=6] Token length.
     * @param {number} [config.period=30] Token time-step duration.
     */
    public constructor({ secret, algorithm = "SHA256", digits = 6, period = 30 }: IConfig) {
        // 判断是否 base32 string
        this.secret = secret;
        this.algorithm = algorithm.toUpperCase();
        this.digits = digits;
        this.period = period;
        this.hotp = new HOTP({
            secret: this.secret,
            algorithm: this.algorithm,
            digits: this.digits,
        });
    }

    /**
     * Generates a TOTP token.
     * Generate a time-based one-time token
     * @param {Object} [config] Configuration options.
     * @param {number} [config.timestamp=Date.now] Timestamp value in milliseconds. 时间基点
     * @returns {string} Token.
     */
    public generate({ timestamp = Date.now() }: IGenerateParam = {}): string {
        const counter = Math.floor(timestamp / 1000 / this.period);
        return this.hotp.generate({ counter });
    }

    /**
     * Validates a TOTP token.
     * Verify a time-based one-time token against the secret and return the delta
     * 验证基于时间窗口的一次性令牌 `token`，并返回增量 `delta` 返回 nul没有找到或0 正负数（表示找到的位置）
     * 默认情况下，在当前时间 `timestamp` 窗口 `window` 验证令牌，没有余量（超前或滞后）
     * 在当前时间窗口时验证的令牌的增量为 0
     *
     * 返回令牌的计数器值与给定计数器值之间的差值。例如，如果给定时间内计数器counter=1000和window=5，
     * 将检查从 995到 1005（含）的令牌
     * 换句话说，如果时间步长为30秒，它将检查从2.5分钟前到未来2.5分（含）的token。
     * 如果它在计数器位置1002处找到它，它将返回 delta=2
     * 如果它在计数器位置997找到它，它将返回delta=-3
     *
     * @param {Object} [config] Configuration options.
     * @param {string} [config.token] Token value.
     * @param {number} [config.timestamp=Date.now] Timestamp value in milliseconds.
     * @param {number} [config.window=1] Window of counter values to test.
     * @returns {number|null} Token delta or null if it is not found in the search window, in which case it should be considered invalid.
     */
    public validate({ token, timestamp = Date.now(), window = 0 }: IInvalidateParam): number | null {
        const counter = Math.floor(timestamp / 1000 / this.period);
        return this.hotp.validate({ token, counter, window });
    }
}
