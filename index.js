const express = require('express');
const app = express();
const colors = require('colors');
const cors = require('cors');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const connectDB = require('./config/mongodb.js');
const bodyParser = require('body-parser');
app.use(cors());

// const connectDB = require('./config/mongodb.js');
app.use(bodyParser.json());

const port = process.env.PORT || 3000;
connectDB();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`app listening on ${port}`);
});
