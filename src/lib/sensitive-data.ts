import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const algorithm = "aes-256-gcm";

export function sensitiveDataEnabled() {
  return Boolean(process.env.FIELD_ENCRYPTION_KEY);
}

export function encryptSensitiveValue(value: string) {
  const key = getKey();
  if (!key) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${authTag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function decryptSensitiveValue(payload: string) {
  const key = getKey();
  if (!key) return null;
  const [ivText, authTagText, encryptedText] = payload.split(".");
  if (!ivText || !authTagText || !encryptedText) return null;
  const decipher = createDecipheriv(algorithm, key, Buffer.from(ivText, "base64"));
  decipher.setAuthTag(Buffer.from(authTagText, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedText, "base64")), decipher.final()]).toString("utf8");
}

function getKey() {
  const value = process.env.FIELD_ENCRYPTION_KEY;
  if (!value) return null;
  return createHash("sha256").update(value).digest();
}
