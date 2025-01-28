import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';


import webAdminRoutes from './routes/Admin/webAdminRoutes.js'
import appUserRoutes from './routes/User/appUserRoutes.js'
import webUserRoutes from './routes/User/webUserRoutes.js'
import analyticsRoutes from './routes/Analytics/analyticsRoutes.js'

dotenv.config();
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use('/cinepulse/api/admin/web/',webAdminRoutes);
app.use('/cinepulse/api/user/app/',appUserRoutes);
app.use('/cinepulse/api/user/web/',webUserRoutes);
app.use('/cinepulse/api/analytics/',analyticsRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello',
  });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on port http://localhost:${process.env.PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

startServer();
