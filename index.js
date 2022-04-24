const express = require('express');
const { readFile } = require('fs');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.static(__dirname));

app.get('/', (request, response) => {
    res.sendFile(__dirname + "/" + "index.html");
});

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});