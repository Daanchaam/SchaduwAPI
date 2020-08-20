const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// Middleware
const auth = require('./middleware/auth');
const hasRole = require('./middleware/role');

// Express setup
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

// Mongoose setup
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, (error) => {
  if (error) throw error;
  console.log('MongoDB connection established');
});

// Route setup
app.use('/api/user', require('./routes/userRouter'));
app.use('/api/match', auth, hasRole('admin', 'referee'), require('./routes/matchRouter'));