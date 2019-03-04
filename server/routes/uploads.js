const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());

app.put('/upload', function(req, res) {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no file selected'
            }
        });
    }

    let sampleFile = req.files.sampleFile;

    let fileNameParts = sampleFile.name.split('.');

    let extension = fileNameParts[fileNameParts.length - 1];

    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + validExtensions.join(', '),
                ext: extension
            }
        });
    }

    sampleFile.mv(`uploads/${ sampleFile.name }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Image uploaded'
        });
    });
});

module.exports = app;