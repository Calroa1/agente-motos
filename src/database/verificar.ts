import db from "./db.js"

const productos = db.prepare("SELECT * FROM productos LIMIT 3").all()
console.log(JSON.stringify(productos, null, 2))
