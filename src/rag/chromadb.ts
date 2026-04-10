import { ChromaClient } from "chromadb"
import { text } from "stream/consumers"

const cliente = new ChromaClient({ path: "http://localhost:8000" })

export async function obtenerColeccion(nombre: string) {
    return await cliente.getOrCreateCollection({ 
        name: nombre,
    embeddingFunction: {generate: async (text:string [])=>[]}
})
}

export async function guardarProductos(productos: {
    id: string
    texto: string
    embedding: number[]
    metadata: { titulo: string, precio: string, url: string }
}[]) {
    const coleccion = await obtenerColeccion("repuestos")

    await coleccion.add({
        ids: productos.map(p => p.id),
        embeddings: productos.map(p => p.embedding),
        documents: productos.map(p => p.texto),
        metadatas: productos.map(p => p.metadata)
    })

    console.log(`✅ ${productos.length} productos guardados en ChromaDB`)
}

export async function buscarProductos(embedding: number[], n: number = 3) {
    const coleccion = await obtenerColeccion("repuestos")

    const resultados = await coleccion.query({
        queryEmbeddings: [embedding],
        nResults: n
    })

    return resultados
}