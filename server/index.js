const express = require('express');
const cors = require('cors');
require('dotenv').config();

const detectRoute = require('./routes/detect');
const explainRoute = require('./routes/explain');
const comboRoute = require("./routes/combo");
const authRoute = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/explain', explainRoute);
app.use('/api/detect', detectRoute);
app.use("/api/combo", comboRoute);

const PORT =3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
