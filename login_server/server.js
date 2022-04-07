//mongodb
require('./config/db');

const app = require('express')();
const port = process.env.PORT || 3000;
const UserRouter = require('./api/User');

const cors = require('cors');
app.use(cors);

// For acceptiing post form data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})