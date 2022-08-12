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
    private readonly secret: string;
    private readonly algorithm: string = "SHA1";
    private readonly digits: number = 6;
    private readonly period: number = 30;
    private readonly hotp: HOTP;

    /**
     * Creates a TOTP object.
     * @param {Object} [config] Configuration options.
     * @param {Secret|string} [config.secret=Secret] Secret key.
     * @param {string} [config.algorithm='SHA1'] HMAC hashing algorithm.
     * @param {number} [config.digits=6] Token length.
     * @param {number} [config.period=30] Token time-step duration.
     */
    public constructor({ secret, algorithm = "SHA1", digits = 6, period = 30 }: IConfig) {
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
     * @param {Object} [config] Configuration options.
     * @param {number} [config.timestamp=Date.now] Timestamp value in milliseconds.
     * @returns {string} Token.
     */
    public generate({ timestamp = Date.now() }: IGenerateParam = {}): string {
        const counter = Math.floor(timestamp / 1000 / this.period);
        return this.hotp.generate({ counter });
    }

    /**
     * Validates a TOTP token.
     * @param {Object} [config] Configuration options.
     * @param {string} [config.token] Token value.
     * @param {number} [config.timestamp=Date.now] Timestamp value in milliseconds.
     * @param {number} [config.window=1] Window of counter values to test.
     * @returns {number|null} Token delta or null if it is not found in the search window, in which case it should be considered invalid.
     */
    public validate({ token, timestamp = Date.now(), window = 1 }: IInvalidateParam): number | null {
        const counter = Math.floor(timestamp / 1000 / this.period);
        return this.hotp.validate({ token, counter, window });
    }
}
