const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
// const fileURLToPath = require('url').fileURLToPath;

const db = require('./db');
const router = require('./routes/router');
const errorHandler = require('./middleware/error-handler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors());
app.use(cookie());
app.use(bodyParser.json({ limit: '25mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));
app.set('view engine', 'ejs');
app.use('/', router);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
app.use(express.static('./public'))

// global error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
});
