const express = require('express');
const { readFile } = require('fs');

const app = express();
app.use(express.static(__dirname));

app.get('/', (request, response) => {
    res.sendFile(__dirname + "/" + "index.html");
});

app.listen(process.env.PORT || 3000, () => {
    console.log('App is available on http://localhost:3000');
});