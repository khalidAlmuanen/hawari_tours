const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    await client.connect();
    const res = await client.query("SELECT typname FROM pg_type WHERE typname = 'HotelStatus' OR typname = 'CarStatus'");
    console.log("Enums in DB:", res.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
