require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://jason:carcamo11@localhost/serenta-api-test",
    JWT_SECRET: process.env.SECRET || "mweifhbwehfewijkfwe",
    NODE_ENV: process.env.NODE_ENV || "development",
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    BUCKET_NAME: process.env.BUCKET_NAME
};