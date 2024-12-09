const db = require("../config/db");
const moment = require("moment-timezone");

// buat note
exports.createNote = (req, res) => {
  const { title, datetime, note } = req.body;

  // Konversi datetime ke zona waktu lokal
  const localDateTime = moment(datetime).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

  const query = "INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)";
  db.query(query, [title, localDateTime, note], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ message: "Note berhasil ditambahkan", id: results.insertId });
  });
};

// nampilin semua notes
exports.getAllNotes = (req, res) => {
  const query = "SELECT * FROM notes";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    // Konversi datetime ke zona waktu lokal
    const notes = results.map((note) => ({
      ...note,
      datetime: moment(note.datetime).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
    }));

    res.json(notes);
  });
};

// nampilin salah satu note berdasarkan id
exports.getNoteById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM notes WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Note tidak ditemukan" });

    // Konversi datetime ke zona waktu lokal
    const note = {
      ...results[0],
      datetime: moment(results[0].datetime).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
    };

    res.json(note);
  });
};

// Update a note
exports.updateNote = (req, res) => {
  const { id } = req.params;
  const { title, datetime, note } = req.body;

  // Konversi datetime ke zona waktu lokal
  const localDateTime = moment(datetime).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

  const query = "UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?";
  db.query(query, [title, localDateTime, note, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Note tidak ditemukan" });
    res.json({ message: "Note berhasil diperbarui" });
  });
};

// Delete a note
exports.deleteNote = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM notes WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Note tidak ditemukan" });
    res.json({ message: "Note berhasil dihapus" });
  });
};
