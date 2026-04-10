import { ChromaClient } from "chromadb"

const cliente = new ChromaClient({ path: "http://localhost:8000" })

await cliente.deleteCollection({ name: "repuestos" })
console.log("🗑️ Colección eliminada")