const Item = require('../models/item');

// obtener todos los elemnetos 
exports.getItems = (req, res) => {
    Item.find()
    .then((items) => {
        res.json(items);
    })
    .catch((error) => {
        res.status(500).json({error: error.message });
    });
};

// Obtener un elemento por su ID 
exports.getItemById = (req, res) => {
    Item.findById(req.params.id) 
    .then((item) => {
        if (!item) {
            return res.status(404).json({ message: 'Elemento no encontrado' });
        }
        res.json(item);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

// Crear un nuevo elemento
exports.createItem = (req, res) => {
    const newItem = new Item({
        name: req.body.name,
        description: req.body.description,
        rate: req.body.rate,
        imagePath: req.file ? `/uploads/${req.file.filename}` : ''
    });
    newItem.save()
    .then((item) => {
        res.status(201).json(item);
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });
};

// Actualizar un elemento existente 
exports.updateItem = (req, res) => {
    const updatedData = {
        name: req.body.name,
        description: req.body.description,
        rate: req.body.rate,
    };

    // Si se ha subido una nueva imagen, actualizamos la propiedad `imagePath`
    if (req.file) {
        updatedData.imagePath = `/uploads/${req.file.filename}`;
    }

    Item.findByIdAndUpdate(req.params.id, updatedData, { new: true })
        .then((item) => {
            if (!item) {
                return res.status(404).json({ message: 'Elemento no encontrado' });
            }
            res.json(item);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};


// Eliminar un elemento existente 
exports.deleteItem = (req, res) => { Item.findByIdAndDelete(req.params.id) .then((item) => {
    if (!item) {
        return res.status(404).json({ message: 'Elemento no encontrado' });
    }
    res.json({ message: 'Elemento eliminado correctamente' });
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });
};