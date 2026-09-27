const { pool } = require ('../DBconection/AppConection');
const format = require ('pg-format');



const getJoyas = async ({ limit = 6, page = 0, order_by = "id"}) => {
    const [campo, orden] = order_by.split("_");
    let offset = page * limit;
    let formatoQuery = format('SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s', campo, orden, limit, offset);
    
    try {
        const result = await pool.query(formatoQuery);
        if (result.rowCount == 0){
            throw new Error('No se enctontraron joyas en la base de datos')
        }
        return result.rows
    }
        catch (error) {
            error.message
        }

    }
    
const preparHATEOAS = async (listaJoyas, limit = 6, page = 0,) => {
    const result = await pool.query('SELECT * FROM inventario')
    const totalJoyas = result.rowCount
    const paginaActual = Number(page)
    const limite = Number(limit)
    const paginaSiguiente = (paginaActual + 1) * limite < totalJoyas
    const results = listaJoyas.map((p) => {
        return {nombre: p.nombre, url: `http://localhost:3000/inventario/${p.id}`, categoria: p.categoria, metal: p.metal, precio: p.precio, stock: p.stock}


})
    
return {
    totalJoyas,
    next: paginaSiguiente ? `http://localhost:3000/inventario/?limit=${limite}&page=${paginaActual + 1}` : null,
    previus: paginaActual > 0 ? `http://localhost:3000/inventario/?limit=${limite}&page=${paginaActual - 1}` : null,
    results

}}

const getFiltredJoyas = async ({ precio_min, precio_max, categoria, metal }) => {
  const filtros = [];
  const valores = [];

  if (precio_min !== undefined) {
    valores.push(precio_min);
    filtros.push(`precio < $${valores.length}`);
  }

  if (precio_max !== undefined) {
    valores.push(precio_max);
    filtros.push(`precio > $${valores.length}`);
  }

  if (categoria) {
    valores.push(categoria);
    filtros.push(`categoria = $${valores.length}`);
  }

  if (metal) {
    valores.push(metal);
    filtros.push(`metal = $${valores.length}`);
  }

  let consulta = "SELECT * FROM inventario";

  if (filtros.length > 0) {
    consulta += ` WHERE ${filtros.join(" AND ")}`;
  }

  const result = await pool.query(consulta, valores);
  return result.rows;
};

module.exports = {getJoyas, preparHATEOAS, getFiltredJoyas}


