const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { checkConnection } = require('./DBconection/AppConection');
const {getJoyas, preparHATEOAS, getFiltredJoyas} = require('./Controllers/AppControls')


const app = express();
app.use(express.json());
app.use(cors());


app.listen(3000, async () => {
    console.log('🟢 Servidor iniciado con exito en -->http://localhost:3000')



try {
    const hora = await checkConnection();
    console.log ('🟢 Servidor conectado a la base de datos en:' + hora)
}
catch (error) {
    console.log('🔴 Error al conectarse a la base de datos:', error.message)

}

});

function consoleRoute (req, res, next) {
    const route = req.route.path
    const archivo = fs.readFileSync("routes.log", "utf-8")
    const nuevoArchivo = archivo + `RUTA CONSULTADA A LAS: ${Date.now()} - ${route}\n`
    fs.writeFileSync("routes.log", nuevoArchivo)
    next()
}

app.get('/inventario', consoleRoute, async (req, res) => {
    const parametros = req.query
    try {
        const result = await getJoyas(parametros)
        const HATEOAS = await preparHATEOAS(result, parametros.limit, parametros.page)
        res.json(HATEOAS);

    }catch (error){
        res.send(error);
    }
});

app.get("/joyas/filtros", async (req, res) => {
    try{
     const joyas = await getFiltredJoyas(req.query);
     res.json(joyas);
    }
    catch(error){
        console.error(error);
        res.json({error: 'Error al consultar el inventario'})
    }

});