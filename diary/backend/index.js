require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandlingMiddleware');
const cookieParser = require("cookie-parser");
const path = require("path");
const fileUpload = require('express-fileupload')

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static/avatars')));
app.use(fileUpload({}))
app.use('/', router);

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