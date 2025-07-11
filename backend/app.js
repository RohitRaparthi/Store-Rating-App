// app.js
const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/api/admin', require('./routes/adminRoutes'));


// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/store-owner', require('./routes/storeOwnerRoutes'));



module.exports = app;
