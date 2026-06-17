const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.post('/api/gerar-qrcode', async (req, res) => {
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ erro: 'O campo texto é obrigatório.' });
    }

    try {
        const qrCodeUrl = await QRCode.toDataURL(texto, {
            width: 300,
            margin: 2,
            errorCorrectionLevel: 'H'
        });
        
        return res.json({ qrCode: qrCodeUrl });
    } catch (err) {
        return res.status(500).json({ erro: 'Erro ao gerar o QR Code.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});