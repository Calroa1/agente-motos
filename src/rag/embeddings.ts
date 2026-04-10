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
const v1 = await generarEmbedding("filtro de aire pulsar 180")
const v2 = await generarEmbedding("elemento filtrante para moto bajaj")
const v3 = await generarEmbedding("cadena de transmision")

console.log("Primer número de cada vector:")
console.log("filtro de aire:     ", v1[0].toFixed(4))
console.log("elemento filtrante: ", v2[0].toFixed(4))
console.log("cadena transmision: ", v3[0].toFixed(4))