import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
if (!process.env.MONGODB_URL) {
    console.error('MONGODB_URL is not defined in the .env file');
    process.exit(1); // Exit the application if MongoDB URL is not defined
}

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server after successful connection
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exit if the connection fails
    });

// Optional: Catch-all route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
