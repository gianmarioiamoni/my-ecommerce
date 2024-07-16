import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import mongoose from 'mongoose';

const CONNECTION_URL = 'your_mongodb_connection_string';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
