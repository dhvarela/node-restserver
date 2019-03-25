const express = require('express');

const fs = require('fs');
const path = require('path');

const { imgTokenVerfication } = require('../middlewares/authentication');

let app = express();


app.get('/image/:type/:img', imgTokenVerfication, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ img }`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }





});


module.exports = app;