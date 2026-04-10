import "dotenv/config"

export async function generarEmbedding(texto: string): Promise<number[]> {
    const respuesta = await fetch("http://localhost:11434/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "nomic-embed-text",
            prompt: texto
        })
    })

    const data = await respuesta.json()
    return data.embedding
}

// Prueba temporal
