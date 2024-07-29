const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}
// Middleware
app.use(cookieParser());
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }));


// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'garage_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// Routes
app.post('/api/signup', (req, res) => {
 
  const { lastname, firstname, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = 'INSERT INTO users (lastname, firstname, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [lastname, firstname, email, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }
    res.status(201).send('User registered');
  });
});

app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;
  
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);

      res.status(500).send('Server error');
      return;
    }
  
    if (results.length === 0) {
      
      res.status(404).send('User not found');
      return;
    }
    
    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    console.log(passwordIsValid);
    if (!passwordIsValid) {
      res.status(401).send('Invalid password');
      //console.log(email, password);
      return;
    }
    const token = jwt.sign({ id: user.id }, 'secret-key', { expiresIn: '1h' });
    res.cookie('token', token, { 
   
      maxAge: 3600000 // 1 heure
    });
    
    res.status(200).json({ auth: true,  token });
  
  });
});
app.post('/api/dashboard/stats', (req, res) => {
  res.status(200).json({ message: 'Stats fetched' });
});
app.post('/api/dashboard/clients', (req, res) => {
  res.status(200).json({
    clients: [
      { id: 1, nom: "Dupont", prenom: "Jean", email: "jean.dupont@email.com", telephone: "0123456789" },
      { id: 2, nom: "Martin", prenom: "Marie", email: "marie.martin@email.com", telephone: "0987654321" },
      { id: 3, nom: "Durand", prenom: "Pierre", email: "pierre.durand@email.com", telephone: "0654321987" },
      { id: 4, nom: "Lefebvre", prenom: "Sophie", email: "sophie.lefebvre@email.com", telephone: "0321654987" },
      { id: 5, nom: "Moreau", prenom: "Luc", email: "luc.moreau@email.com", telephone: "0789456123" }
    ]
  });
});
app.post('/api/dashboard/appointements', (req, res) => {
  res.status(200).json({ message: 'Appointements fetched' });
});
app.use(express.static(path.join(__dirname, "./client/dist")))
app.get("*", (_, res) => {
    res.sendFile(
      path.join(__dirname, "./client/dist/index.html")
    )
})
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
