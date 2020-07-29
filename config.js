require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://jason:carcamo@localhost/{ database name here }",
    JWT_SECRET: process.env.SECRET || "mweifhbwehfewijkfwe",
    NODE_ENV: process.env.NODE_ENV || "development"
};