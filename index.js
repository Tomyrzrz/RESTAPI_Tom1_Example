
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const morgan = require('morgan');

const PORT = process.env.PORT || 3050; 

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

try {
    const conexion = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "utom",
    });
} catch (error) {
    console.log("Error: " + error.message);
}

app.get('/', (req, res) => {
    res.send("Welcome to my API REST BASIC Timo Ruiz");
});

//Endpoints   rutas donde tus consultar u obtener alguna informacion.
app.get('/users', (req, res) => {
    const sql = "SELECT * FROM usuarios";
    conexion.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0 ){
            res.json(results);
        }else{
            res.send("Not results for this query!");
        }
    });
});

app.get('/user/:uid', (req, res) => {
    const {uid} = req.params;
    const sql = `SELECT * FROM usuarios WHERE uid=${uid}`;
    conexion.query(sql, (error, results) => {
        if(error)throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send("No results. Please try again.");
        }
    });
});

app.post('/add', (req, res) => {
    const sql = 'INSERT INTO usuarios SET ?';
    const userObj = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        password: req.body.password,
        tipo: req.body.tipo,
        token: req.body.token,
    }
    conexion.query(sql, userObj, error => {
        if (error) throw error;
        res.send("User registered correctly");
    });
});

app.put('/update/:uid', (req, res) =>{
    const {uid} = req.params;
    const {nombre, apellidos, email, password, tipo, token} = req.body;
    const sql = `UPDATE usuarios SET nombre='${nombre}', apellidos='${apellidos}', 
        email='${email}', password='${password}', tipo='${tipo}' WHERE uid=${uid}`;
    
    conexion.query(sql, error =>{
        if (error) throw error;
        res.send("Updated user.");
    });
});

app.delete('/delete/:uid', (req, res) => {
    const {uid} = req.params;
    const sql = `DELETE FROM usuarios WHERE uid=${uid}`;
    conexion.query(sql, error => {
        if (error) throw error;
        res.send('User Deleted.');
    });
});





conexion.connect(error => {
    if(error) {throw error;
    console.log("Error connecting to Database");}
});

app.listen(PORT, () => console.log(`Server running in the PORT ${PORT}`));

