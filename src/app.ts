import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import gadgetRoutes from './routes/gadgets.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/gadgets', gadgetRoutes);
app.use('/api/auth', authRoutes);

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`IMF Gadget Management API running on port ${PORT}`);
});

export default app;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI3ODllNjAzLTdhNzYtNDczOC04NjJkLTY5ZDVhYmIzMGY1NSIsInVzZXJuYW1lIjoiYWdlbnQwMDciLCJyb2xlIjoiRElSRUNUT1IiLCJpYXQiOjE3Mzc5MDI3MjEsImV4cCI6MTczNzkwNjMyMX0.riJ-ZReX0873Pp9utRCB4rqZxVbBx_3HFEKkLyT-nC4
