const express = require('express');
const app = express();
const PORT = 3000; // Port numarasını kontrol edin

app.use(express.json());

// Basit bir GET metodu
app.get('/api/points', (req, res) => {
    res.json([{ x: 35.0, y: 39.0, name: "Example Point" }]);
});

// Basit bir POST metodu
app.post('/api/points', (req, res) => {
    const point = req.body;
    console.log('New point added:', point);
    res.status(201).json(point);
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
