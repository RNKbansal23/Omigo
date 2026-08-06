// Re-export the database client and connection utilities from the shared workspace package
const { prisma, connectDB, disconnectDB } = require('@marketplace/database');

module.exports = { prisma, connectDB, disconnectDB };
