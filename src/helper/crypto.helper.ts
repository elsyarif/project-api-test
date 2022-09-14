import { createDecipheriv, createCipheriv } from "crypto";

const key = Buffer.from(process.env.KEY_BUFFER, "hex");
const iv = Buffer.from(process.env.IV_BUFFER, "hex");

// Encrypting text
export function Encrypt(text: string) {
	let cipher = createCipheriv("aes-256-cbc", key, iv);
	let encrypted = cipher.update(text, "utf-8", "hex");
	encrypted += cipher.final("hex");

	return encrypted;
}

// Decrypting text
export function Decrypt(text: any) {
	let decipher = createDecipheriv("aes-256-cbc", key, iv);
	let decrypted = decipher.update(text, "hex", "utf-8");

	decrypted += decipher.final("utf-8");

	return decrypted;
}
