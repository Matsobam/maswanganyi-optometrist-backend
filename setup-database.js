const { Sequelize } = require('sequelize');

// First connect without specifying database to create it
const setupSequelize = new Sequelize('mysql', 'root', '', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  logging: console.log
});

const createDatabase = async () => {
  try {
    // Test connection to MySQL server
    await setupSequelize.authenticate();
    console.log('✅ Connected to MySQL server successfully');

    // Create database if it doesn't exist
    await setupSequelize.query('CREATE DATABASE IF NOT EXISTS optometrist_practice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database "optometrist_practice" created successfully');

    // Close the setup connection
    await setupSequelize.close();
    console.log('✅ Database setup completed');
    
    return true;
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    return false;
  }
};

// Run the setup
createDatabase().then(success => {
  if (success) {
    console.log('🎉 Database is ready! You can now start your server.');
  } else {
    console.log('💥 Database setup failed. Please check your XAMPP MySQL service.');
  }
  process.exit(success ? 0 : 1);
});
