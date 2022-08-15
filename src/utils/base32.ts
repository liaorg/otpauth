/**
 * RFC 4648 base32 alphabet without pad.
 * @type {string}
 */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Converts a base32 string to an ArrayBuffer (RFC 4648).
 * @see [LinusU/base32-decode](https://github.com/LinusU/base32-decode)
 * @param {string} str Base32 string.
 * @returns {ArrayBuffer} ArrayBuffer.
 */
const base32ToBuf = (str: string): ArrayBuffer => {
    // Canonicalize to all upper case and remove padding if it exists.
    let end = str.length;
    while (str[end - 1] === "=") --end;
    const cstr = (end < str.length ? str.substring(0, end) : str).toUpperCase();

    const buf = new ArrayBuffer(((cstr.length * 5) / 8) | 0);
    const arr = new Uint8Array(buf);
    let bits = 0;
    let value = 0;
    let index = 0;

    for (const x of cstr) {
        const idx = ALPHABET.indexOf(x);
        if (idx === -1) throw new TypeError(`Invalid character found: ${x}`);

        value = (value << 5) | idx;
        bits += 5;

        if (bits >= 8) {
            bits -= 8;
            arr[index++] = value >>> bits;
        }
    }

    return buf;
};

/**
 * Converts an ArrayBuffer to a base32 string (RFC 4648).
 * @see [LinusU/base32-encode](https://github.com/LinusU/base32-encode)
 * @param {ArrayBuffer} buf ArrayBuffer.
 * @returns {string} Base32 string.
 */
const base32FromBuf = (buf: ArrayBuffer): string => {
    const arr = new Uint8Array(buf);
    let bits = 0;
    let value = 0;
    let str = "";

    for (const x of arr) {
        value = (value << 8) | x;
        bits += 8;

        while (bits >= 5) {
            str += ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }

    if (bits > 0) {
        str += ALPHABET[(value << (5 - bits)) & 31];
    }

    return str;
};

/**
 * Generates an Base32 string.
 * @param str {string}
 * @returns {string} Base32 string
 */
const generateBase32 = (str: string): string => {
    const buf = Buffer.from(str);
    return base32FromBuf(buf);
};

export { base32ToBuf, base32FromBuf, generateBase32 };
