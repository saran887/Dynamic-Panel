const sequelize = require('./db');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');


const app = express();

// Serve static files from uploads directory
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

app.use(cors());
app.use(bodyParser.json());


// Sync DB and authenticate
const User = require('./models/userModel');
const Logo = require('./models/logoModel');
const Blog = require('./models/blogModel');
const Category = require('./models/categoryModel');
const Product = require('./models/productModel');
const blogRoutes = require('./routes/blogRoutes');
const productRoutes = require('./routes/productRoutes');

async function resetAllIfNoUsers() {
  const userCount = await User.count();
  if (userCount === 0) {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await Blog.destroy({ where: {}, truncate: true });
    await Logo.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
    await sequelize.query('ALTER TABLE Blogs AUTO_INCREMENT = 1');
    await sequelize.query('ALTER TABLE Logos AUTO_INCREMENT = 1');
    await sequelize.query('ALTER TABLE users AUTO_INCREMENT = 1');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('User, Blog, and Logo table auto-increment counters reset to 1 (on server start).');
  }
}

sequelize.sync()
  .then(async () => {
    console.log('All models were synchronized successfully.');
    await resetAllIfNoUsers();
  })
  .catch(err => console.error('Model synchronization error:', err));
sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Mount auth, blog, and product routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/product', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
