import { generarEmbedding } from "./embeddings.js"
import { buscarProductos } from "./chromadb.js"

export async function buscarRepuestosSemantic(pregunta: string) {
    const embedding = await generarEmbedding(pregunta)
    const resultados = await buscarProductos(embedding, 3)

    const productos = resultados.documents[0].map((doc, i) => ({
        texto: doc,
        metadata: resultados.metadatas[0][i],
        distancia: resultados.distances?.[0][i]
    }))

    return productos
}

// Prueba temporal
