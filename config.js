require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 8000,
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://jason:carcamo11@localhost/serenta-api-test",
    JWT_SECRET: process.env.SECRET || "mweifhbwehfewijkfwe",
    NODE_ENV: process.env.NODE_ENV || "development",
    AccessKeyId: process.env.AccessKeyId,
    SecretAccessKey: process.env.SecretAccessKey,
    BucketName: process.env.BucketName
};