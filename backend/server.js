const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const path = require('path');
const client = require('prom-client');

const app = express();
const PORT = 3000;

client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total de requisições HTTP recebidas.',
    labelNames: ['method', 'route', 'status_code']
});

const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duração das requisições HTTP em segundos.',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    if (req.path === '/metrics') {
        return next();
    }

    const end = httpRequestDurationSeconds.startTimer();

    res.on('finish', () => {
        const labels = {
            method: req.method,
            route: req.route?.path || 'unmatched',
            status_code: String(res.statusCode)
        };

        httpRequestsTotal.inc(labels);
        end(labels);
    });

    next();
});

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        return res.send(await client.register.metrics());
    } catch (err) {
        return res.status(500).send('Erro ao coletar métricas.');
    }
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em ${PORT}`);
});
