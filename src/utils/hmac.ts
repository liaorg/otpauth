import { createHmac } from "crypto";

/**
 * Calculates an HMAC digest.
 * @param {string} algorithm Algorithm.
 * @param {ArrayBuffer} key Key.
 * @param {ArrayBuffer} message Message.
 * @returns {ArrayBuffer} Digest.
 */
export const hmacDigest = (algorithm: string, key: ArrayBuffer, message: ArrayBuffer): ArrayBuffer => {
    const hmac = createHmac(algorithm, Buffer.from(key));
    hmac.update(Buffer.from(message));
    return hmac.digest().buffer;
};
