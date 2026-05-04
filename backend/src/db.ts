import mysql from "mysql2";

export const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234567",
  database: process.env.DB_NAME || "docshare",
  ssl: process.env.DB_HOST && process.env.DB_HOST !== "localhost"
    ? { rejectUnauthorized: false }
    : undefined,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to the database.");
  }
});