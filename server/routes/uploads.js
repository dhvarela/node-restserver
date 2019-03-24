const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
let Product = require('../models/product');

// import file sistem package
const fs = require('fs');
const path = require('path');

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

        if (type == 'users') {
            userImage(id, res, fileName);
        } else {
            productImage(id, res, fileName);
        }

    });
});

function userImage(id, res, fileName) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            deleteFile(fileName, 'users');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            deleteFile(fileName, 'users');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User does not exist'
                }
            });
        }

        deleteFile(usuarioDB.img, 'users');

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

function productImage(id, res, fileName) {

    Product.findById(id, (err, productDB) => {

        if (err) {
            deleteFile(fileName, 'products');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            deleteFile(fileName, 'products');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product does not exist'
                }
            });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = fileName;

        productDB.save((err, productSaved) => {

            res.json({
                ok: true,
                product: productSaved,
                img: fileName
            })

        });


    });

}

function deleteFile(imageName, type) {

    // check if old image exists to remove
    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ imageName }`);

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }

}

module.exports = app;