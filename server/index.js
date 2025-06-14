const express = require('express');
const cors = require('cors');
require('dotenv').config();

const detectRoute = require('./routes/detect');
const explainRoute = require('./routes/explain');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/explain', explainRoute)

app.use('/api/detect', detectRoute);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
