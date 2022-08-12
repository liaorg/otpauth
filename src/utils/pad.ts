/**
 * Pads a number with leading zeros.
 * @param {number|string} num Number.
 * @param {number} digits Digits.
 * @returns {string} Padded number.
 */
export const pad = (num: number | string, digits: number): string => {
    let prefix = "";
    let repeat = digits - String(num).length;
    while (repeat-- > 0) prefix += "0";
    return `${prefix}${num}`;
};
