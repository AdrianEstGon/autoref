const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

var serviceAccount = require("./src/firebaseConfig/autoref-dcd7a-firebase-adminsdk-fbsvc-b55f42eb8d.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const apiRoutes = require('./src/routes/Routes');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/routes', apiRoutes);

// Iniciar el servidor
const port = 3001;
app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
});