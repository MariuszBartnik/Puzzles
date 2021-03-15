const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes =  require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

const mainController =  require('./controllers/mainController');

const app = express();

// Middleware
dotenv.config();
app.use(helmet());
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());


// Connect ot db and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        app.listen(PORT);
        console.log(`DB connected, app listen on port ${PORT}`);
    }).catch(err => console.log(err)); 

// Routes
app.get('/', mainController.index_get);
app.get('/is_logged', mainController.index_isLogged_get);
app.use('/auth', authRoutes);
app.use('/game', gameRoutes);
app.get('*', mainController.page_404_get);
