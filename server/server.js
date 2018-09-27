var path = require('path');
var express = require('express');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
var app = express();

// Middleware to serve public directory
app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})