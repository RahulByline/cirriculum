require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');


const adminSettingsRoutes = require('./routes/adminSettings');
const adminUsersRoutes = require('./routes/adminUsers');

const app = express();


app.get('/api/health', async (req, res) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok', db: 'connected' });
    } catch {
      res.status(500).json({ status: 'error', db: 'not connected' });
    }
  });
app.use(cors());
app.use(express.json());

app.use('/api/admin_settings', adminSettingsRoutes);
app.use('/api/admin_users', adminUsersRoutes);

app.get('/', (req, res) => {
  res.send('Calculator Backend API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 