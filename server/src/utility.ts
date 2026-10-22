import { createHash, pbkdf2, timingSafeEqual } from "crypto";
import { promisify } from "util";

const pbkdf2Hash = promisify(pbkdf2)

export const pbkdf2Promisified = (password: string, salt: Buffer) => {
    return pbkdf2Hash(password, salt, 100000, 32, 'sha256')
} 

export function hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex')
}

export function compareTokenHash(token: string, storedHash:string) {
    const incoming = Buffer.from(hashToken(token))
    const stored = Buffer.from(storedHash)
    if(incoming.length !== stored.length){
        return false
    }
    return timingSafeEqual(incoming, stored)
}


