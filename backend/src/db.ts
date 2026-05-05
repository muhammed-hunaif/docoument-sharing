import mysql from "mysql2";

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234567",
  database: process.env.DB_NAME || "docshare",
  ssl: process.env.DB_HOST && process.env.DB_HOST !== "localhost"
    ? { rejectUnauthorized: false }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("✅ Database Pool initialized.");