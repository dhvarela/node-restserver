const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no file selected'
            }
        });
    }

    // check type
    let validTypes = ['products', 'users'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + validTypes.join(', ')
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

    // change file name
    let fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    sampleFile.mv(`uploads/${ type }/${ fileName }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        userImage(id, res, fileName);

    });
});

function userImage(id, res, fileName) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User does not exist'
                }
            });
        }

        usuarioDB.img = fileName;

        usuarioDB.save((err, userSaved) => {

            res.json({
                ok: true,
                usuario: userSaved,
                img: fileName
            })

        });


    });

}

function productImage() {

}

module.exports = app;