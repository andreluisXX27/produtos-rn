const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Denuncia = require('./Denuncia');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/denuncias?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

app.get('/denuncias', async (req, res) => {
    const denuncias = await Denuncia.find();
    res.json(denuncias);
});

app.post('/denuncias', async (req, res) => {
    const { titulo, descricao, local } = req.body;
    const denuncia = new Denuncia({ titulo, descricao, local });
    await denuncia.save();
    res.json(denuncia);
});

app.delete('/denuncias/:id', async (req, res) => {
    await Denuncia.findByIdAndDelete(req.params.id);
    res.send('Denúncia deletada com sucesso');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
