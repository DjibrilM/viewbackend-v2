import { randomInt } from "crypto";


export const resetpasswordToken = (): number => {
    var token = randomInt(0, 10 ** 8 - 1).toString().padStart(8, "0");
    return parseFloat(token);
}
