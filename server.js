import express from 'express';
import bodyParser from 'body-parser';
import cookie from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from './db.js';
import router from './routes/router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors());
app.use(cookie());
app.use(bodyParser.json({ limit: '25mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));
app.set('view engine', 'ejs');
app.use('/', router);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '/public')))

app.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
});
