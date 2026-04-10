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
        const texto = `
        Tipo de repuesto: ${producto.product_type}
        Producto: ${producto.title}
        Marca: ${producto.vendor}
        Descripción: ${limpiarHtml(producto.body_html)}
            `.trim()
        const embedding = await generarEmbedding(texto)

        productosParaGuardar.push({
            id: String(producto.id),
            texto,
            embedding,
            metadata: {
                id: String(producto.id),
                titulo: producto.title,
            
            }
        })

        console.log(`✅ ${producto.title}`)
    }

    await guardarProductos(productosParaGuardar)
    console.log("🎉 Indexación completa")
}

indexar()