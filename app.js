// server.js
const express = require("express");
const cors = require("cors");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { connectDb } = require("./config/connectDB");
const userRoutes = require("./routes/userRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes"); // Schedule routes

dotenv.config();
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Connect to the database
connectDb();

// Routes
app.get('/', (req, res) => {
    res.send("<h1>Hello, Welcome to the API</h1>");
});

app.use('/api/schedules', scheduleRoutes);
app.use('/api/users', userRoutes);
// Schedule routes

// Port
const PORT = process.env.PORT || 8080;

// Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.green);
});
