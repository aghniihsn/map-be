// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/petaDB';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Terhubung!'))
  .catch(err => console.error(err));

// --- 1. UPDATE SCHEMA (Tambah field baru) ---
const LocationSchema = new mongoose.Schema({
    nama: String,
    deskripsi: String, // Tambahan
    kategori: String,  // Tambahan (misal: 'wisata', 'kuliner')
    latitude: Number,
    longitude: Number,
    waktu: { type: Date, default: Date.now }
});

const Location = mongoose.model('Location', LocationSchema);

// --- ROUTES ---

// GET: Ambil semua data
app.get('/api/locations', async (req, res) => {
    try {
        const data = await Location.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Simpan data (Update menerima field baru)
app.post('/api/locations', async (req, res) => {
    const { nama, deskripsi, kategori, latitude, longitude } = req.body;

    const lokasiBaru = new Location({
        nama, deskripsi, kategori, latitude, longitude
    });

    try {
        const savedLocation = await lokasiBaru.save();
        res.status(201).json(savedLocation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Hapus lokasi berdasarkan ID (Fitur Baru)
app.delete('/api/locations/:id', async (req, res) => {
    try {
        await Location.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lokasi berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server update berjalan di port ${PORT}`);
});