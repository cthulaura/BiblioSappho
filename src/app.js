require('dotenv-safe').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./database/dbConnect');
const usersRoutes = require('./routes/usersRoutes');
const worksRoutes = require('./routes/worksRoutes');
const index = require("./routes/index");
const app = express();

app.use(express.json());
app.use(cors());
mongoose.connect();

app.use('/BiblioSappho/users', usersRoutes);
app.use('/BiblioSappho/works', worksRoutes)
app.use('/BiblioSappho', index);

module.exports = app;