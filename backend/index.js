const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter')
const AiRouter = require('./Routes/AiRouter')

const connectDB = require('./Models/db');
require('dotenv').config();


connectDB();

const PORT = process.env.PORT || 8080;



app.use(bodyParser.json());
app.use(cors());


app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("Backend running successfully!");
});

app.get('/ping',(req, res)=>{
    res.send('PONG');
});
app.use('/auth',AuthRouter);
app.use('/products', ProductRouter);
app.use('/ai', AiRouter);


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})