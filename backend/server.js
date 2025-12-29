const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/auth', require('./routes/authRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));

app.head('/', (req, res) => {
    res.status(200).end();
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
