const express = require('express');

let { tokenVerify } = require('../middlewares/authentication');

let Product = require('../models/product');

let app = express();



// ================
// get all products
// ================

app.get('/products', tokenVerify, (req, res) => {

    let desde = req.query.desde = 0;
    desde = Number(desde);

    Product.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            });

        });



});

// ================
// get one product
// ================

app.get('/product/:id', tokenVerify, (req, res) => {

    let id = req.params.id;

    Product.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID not found'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            })

        })
});

// ================
// Create a product
// ================

app.post('/product', tokenVerify, (req, res) => {

    let body = req.body;

    let product = new Product({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    product.save((err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            product: productDB
        })

    });
});

// ================
// Update a product
// ================

app.put('/product/:id', tokenVerify, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    messasge: 'El ID no existe'
                }
            })
        }

        productDB.nombre = body.nombre;
        productDB.precioUni = body.precioUni;
        productDB.descripcion = body.descripcion;
        productDB.categoria = body.categoria;
        productDB.disponible = body.disponible;

        productDB.save((err, productSaved) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                product: productSaved
            });

        });

    });


});


// ================
// Delete a product
// ================

app.delete('/product/:id', tokenVerify, (req, res) => {

    let id = req.params.id;

    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    messasge: 'El ID no existe'
                }
            })
        }

        productDB.disponible = false;

        productDB.save((err, productDeleted) => {

            res.json({
                ok: true,
                product: productDeleted,
                message: 'Product deleted'
            })

        });

    })



});


module.exports = app;