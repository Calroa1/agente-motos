import "dotenv/config"
import { generarEmbedding } from "./embeddings.js"
import { guardarProductos } from "./chromadb.js"

async function obtenerProductos(handle: string) {
    const url = `https://mundimotos.com/collections/${handle}/products.json`
    const respuesta = await fetch(url)
    const data = await respuesta.json()
    return data.products
}

function limpiarHtml(texto: string) {
    return texto.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

async function indexar() {
    console.log("🔄 Obteniendo productos de Mundimotos...")
    const productos = await obtenerProductos("bajaj-pulsar-180")

    console.log(`📦 ${productos.length} productos encontrados. Generando embeddings...`)

    const productosParaGuardar = []

    for (const producto of productos) {
        const texto = `${producto.title}. ${limpiarHtml(producto.body_html)}`
        const embedding = await generarEmbedding(texto)

        productosParaGuardar.push({
            id: String(producto.id),
            texto,
            embedding,
            metadata: {
                titulo: producto.title,
                precio: producto.variants[0].price,
                url: producto.images?.[0]?.src ?? ""
            }
        })

        console.log(`✅ ${producto.title}`)
    }

    await guardarProductos(productosParaGuardar)
    console.log("🎉 Indexación completa")
}

indexar()