require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const app = express();
const todoRoutes = require('./routes/todos');

connectDB().catch(err => {
  console.error('❌ 無法連線到資料庫', err);
  process.exit(1);
});

app.use(express.json());
app.use('/todos', todoRoutes);

// 全域錯誤處理 middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express+MongoDB 伺服器運行於 http://localhost:${PORT}`);
});