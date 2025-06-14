require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandlingMiddleware');
const cookieParser = require("cookie-parser");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cookieParser())
app.use(cors({
    origin: ['http://45.130.9.13', 'http://localhost:3000'],
    credentials: true,
}))
app.use(express.json());

app.use('/avatars', express.static(path.resolve(__dirname, 'uploads/avatars')));

app.use(express.static(path.resolve(__dirname, '../frontend/dist')));

app.use(errorHandler);

app.get('/', (req, res) => {
    res.status(200).json('Server started!');
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e)
    }
}
start()