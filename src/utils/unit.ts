/**
 * Converts an integer to an ArrayBuffer.
 * @param {number} num Integer.
 * @returns {ArrayBuffer} ArrayBuffer.
 */
const uintToBuf = (num: number): ArrayBuffer => {
    const buf = new ArrayBuffer(8);
    const arr = new Uint8Array(buf);
    let acc = num;

    for (let i = 7; i >= 0; i--) {
        if (acc === 0) break;
        arr[i] = acc & 255;
        acc -= arr[i];
        acc /= 256;
    }

    return buf;
};

/**
 * Converts an ArrayBuffer to an integer.
 * @param {ArrayBuffer} buf ArrayBuffer.
 * @returns {number} Integer.
 */
const uintFromBuf = (buf: ArrayBuffer): number => {
    const arr = new Uint8Array(buf);
    let num = 0;

    for (const x of arr) {
        if (x !== 0) {
            num *= 256;
            num += x;
        }
    }

    return num;
};

export { uintToBuf, uintFromBuf };
