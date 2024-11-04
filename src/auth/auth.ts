import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    email: string;
    name: string
    exp: number;
}

export function decodeAccessToken(accessToken: string): TokenPayload {
    try {
        const decoded = jwtDecode<TokenPayload>(accessToken);
        console.log("Decoded token:", decoded);
        return decoded;
    } catch (error) {
        console.error("Failed to decode token:", error);
        throw error;
    }
}