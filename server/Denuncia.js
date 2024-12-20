const mongoose = require('mongoose');

const DenunciaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    local: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }
});

module.exports = mongoose.model('Denuncia', DenunciaSchema);
