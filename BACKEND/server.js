const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const http = require('http');

const app = express();
const port = process.env.PORT || 3001;

// Membuat server HTTP menggunakan http.createServer
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Folder untuk menyimpan gambar yang diunggah
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inisialisasi database SQLite
const db = new sqlite3.Database('./database.db');

// Membuat tabel jika belum ada
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, email TEXT, role TEXT DEFAULT 'user', lastSeen TEXT)");

    db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, text TEXT, image TEXT, date TEXT)");

    // Pastikan kolom role ada di tabel users
    db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'", (err) => {
        if (err) {
            if (err.message.includes("duplicate column name")) {
                console.log("Kolom 'role' sudah ada");
            } else {
                console.error("Error menambahkan kolom 'role':", err.message);
            }
        } else {
            console.log("Kolom 'role' berhasil ditambahkan");
        }
    });

    // Menambahkan kolom lastSeen jika belum ada
    db.run("ALTER TABLE users ADD COLUMN lastSeen TEXT", (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.error("Error menambahkan kolom 'lastSeen':", err.message);
        } else {
            console.log("Kolom 'lastSeen' sudah ada atau berhasil ditambahkan");
        }
    });
});

// Konfigurasi untuk penyimpanan file gambar menggunakan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Folder tujuan penyimpanan file
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nama file yang disimpan
    }
});

const upload = multer({ storage: storage });

// Validasi email sederhana
const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
};

// Rute untuk registrasi user
app.post('/register', (req, res) => {
    console.log(req.body);  // Melihat data yang dikirim dari frontend
    const { username, password, email, role } = req.body;

    if (!username || !password || !email || !role || !isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    db.run("INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)", [username, password, email, role], function (err) {
        if (err) {
            console.error("Error saat menyimpan user ke database:", err);
            return res.status(500).json({ message: 'Error registering user' });
        }
        res.status(200).json({ message: 'User registered successfully' });
    });
});

// Rute untuk login user
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (row) {
            const lastSeen = new Date().toISOString();
            db.run("UPDATE users SET lastSeen = ? WHERE id = ?", [lastSeen, row.id], (err) => {
                if (err) {
                    console.error("Error memperbarui last seen:", err);
                }
            });

            res.status(200).json({ message: 'Login successful', username: row.username, role: row.role });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    });
});

// Rute untuk posting teks dan gambar
app.post('/post', upload.single('image'), (req, res) => {
    const { username, text } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!username || !text) {
        return res.status(400).json({ message: 'Text and username are required' });
    }

    const date = new Date().toISOString();
    db.run("INSERT INTO posts (username, text, image, date) VALUES (?, ?, ?, ?)", [username, text, image, date], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error posting text and image' });
        }
        res.status(200).json({ message: 'Text and image posted successfully' });
    });
});

// Rute untuk menghapus postingan berdasarkan ID
app.delete('/post/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM posts WHERE id = ?", [id], function (err) {
        if (err) {
            console.error("Error deleting post:", err);
            return res.status(500).json({ message: 'Error deleting post' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    });
});

// Rute untuk menghapus user berdasarkan ID
app.delete('/user/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({ message: 'Error deleting user' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Rute untuk memperbarui data user berdasarkan ID
app.put('/user/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    db.run("UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?", 
           [username, email, password, role, id], function (err) {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).json({ message: 'Error updating user' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Rute untuk mengedit postingan berdasarkan ID
app.put('/post/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const image = req.file ? req.file.filename : null;

    if (image) {
        db.run("UPDATE posts SET text = ?, image = ? WHERE id = ?", [text, image, id], function (err) {
            if (err) {
                console.error("Error updating post:", err);
                return res.status(500).json({ message: 'Error updating post' });
            }
            res.status(200).json({ message: 'Post updated successfully' });
        });
    } else {
        db.run("UPDATE posts SET text = ? WHERE id = ?", [text, id], function (err) {
            if (err) {
                console.error("Error updating post:", err);
                return res.status(500).json({ message: 'Error updating post' });
            }
            res.status(200).json({ message: 'Post updated successfully' });
        });
    }
});

// Rute untuk mendapatkan postingan berdasarkan ID
app.get('/post/:id', (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error("Error fetching post:", err);
            return res.status(500).json({ message: 'Error retrieving post' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(row);
    });
});

// Rute untuk mendapatkan postingan berdasarkan username
app.get('/posts/:username', (req, res) => {
    const { username } = req.params;

    db.all("SELECT * FROM posts WHERE username = ?", [username], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving posts' });
        }
        res.status(200).json(rows);
    });
});

// Rute untuk mendapatkan user berdasarkan ID
app.get('/user/:id', (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving user' });
        }
        res.status(200).json(row);
    });
});

// Rute untuk admin dashboard (menampilkan user dan post)
app.get('/admin', (req, res) => {
    const username = req.query.username;

    if (username) {
        const lastSeen = new Date().toISOString();
        db.run("UPDATE users SET lastSeen = ? WHERE username = ?", [lastSeen, username], (err) => {
            if (err) {
                console.error("Error memperbarui last seen:", err);
            }
        });
    }

    db.all("SELECT id, username, email, password, role, lastSeen FROM users", [], (err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Error mengambil data users' });
        } else {
            db.all("SELECT * FROM posts", [], (err, posts) => {
                if (err) {
                    return res.status(500).json({ message: 'Error mengambil data posts' });
                } else {
                    res.status(200).json({ users, posts });
                }
            });
        }
    });
});

// // Fungsi untuk memperbarui lastSeen
// app.post('/updateLastSeen', (req, res) => {
//     const { username } = req.body;
//     const lastSeen = new Date().toISOString();

//     db.run("UPDATE users SET lastSeen = ? WHERE username = ?", [lastSeen, username], (err) => {
//         if (err) {
//             console.error("Error updating lastSeen:", err);
//             return res.status(500).json({ message: 'Error updating last seen' });
//         }
//         res.status(200).json({ message: 'Last seen updated' });
//     });
// });
