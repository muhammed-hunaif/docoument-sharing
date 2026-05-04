import "dotenv/config";
import { db } from "./db";

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const createFilesTable = `
CREATE TABLE IF NOT EXISTS files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  original_name VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  size BIGINT,
  mimetype VARCHAR(100),
  file_code VARCHAR(10) UNIQUE,
  expires_at DATETIME,
  imagekit_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`;

console.log("Starting database setup...");

db.connect((err) => {
  if (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }

  console.log("Connected to Aiven MySQL.");

  db.query(createUsersTable, (err) => {
    if (err) {
      console.error("Error creating users table:", err.message);
    } else {
      console.log("✅ Users table ready.");
    }

    db.query(createFilesTable, (err) => {
      if (err) {
        console.error("Error creating files table:", err.message);
      } else {
        console.log("✅ Files table ready.");
      }
      
      console.log("Database setup complete!");
      db.end();
      process.exit(0);
    });
  });
});
