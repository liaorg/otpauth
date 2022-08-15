import { HOTP, TOTP, generateBase32 } from "../src";

const base32str1 = generateBase32("base32-decoded secret");
console.log(base32str1);

const base32str =
    "6OWYXIW7QEYH34MFXCCXPZUBQDTIXBSX5GPKX4MSU2W6NHFNY2DOTEVK5OILVXN33GB6HN4QHHYLDN4AFTZZNH476KG3RAWESDUKZNHQW2KJLYMLTBHNJNPSTW33J4MAWWKNHPA";
const hotp = new HOTP({
    secret: base32str,
    // algorithm: "SHA1",
    // digits: 6,
    counter: 1e10,
});

// Generate a token.
const token1 = hotp.generate();
console.log(token1, hotp.validate({ token: "147664", counter: 1e10 - 90, window: 100 }));

const totp = new TOTP({
    secret: base32str,
    // algorithm: "SHA256",
    // digits: 8,
    period: 5,
});
// Generate a token.
const token2 = totp.generate({ timestamp: 1451606400000 });
console.log(
    token2,
    totp.validate({ token: token2, timestamp: 1451603700000, window: 100 }),
    totp.validate({ token: "757316", timestamp: 1451606395000 }),
);
