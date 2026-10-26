export const authConfig = {
  secret: process.env.JWT_SECRET || "rahasia-super-aman-sisabaik",
  issuer: "sisabaik-api",
  audience: "sisabaik-client",
  ttl: process.env.JWT_TTL || "7d",
  cost: 10,
};