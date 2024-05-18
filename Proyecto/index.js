//#region Importante
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
console.log(`Comenzando ejecución en http://localhost:${PORT}`)

app.use(express.static('WebSite'));

app.listen(PORT, () => {
    console.log("El servidor ahora está escuchando...");
});
//#endregion

app.post('/', (req, res) => {
    console.log("Se recibieron los datos");
    res.send("asd");
})