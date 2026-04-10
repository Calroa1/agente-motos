import Database from "better-sqlite3"
import path from "path"

// Crea el archivo repuestos.db en la carpeta data/
const db = new Database(path.join(process.cwd(), "data", "repuestos.db"))

// Crea la tabla si no existe
db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        precio REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        imagen TEXT
    )
`)

console.log("✅ Base de datos lista")

export default db