import "dotenv/config"
import db from "./db.js"

async function obtenerProductos(handle: string) {
    const url = `https://mundimotos.com/collections/${handle}/products.json`
    const respuesta = await fetch(url)
    const data = await respuesta.json() as any
    return data.products
}

function limpiarHtml(texto: string) {
    return texto.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

async function sincronizar(colecciones: string[]) {
    const insertar = db.prepare(`
        INSERT OR REPLACE INTO productos (id, titulo, precio, stock, imagen)
        VALUES (@id, @titulo, @precio, @stock, @imagen)
    `)

    let total = 0

    for (const handle of colecciones) {
        console.log(`🔄 Sincronizando: ${handle}`)
        const productos = await obtenerProductos(handle)

        for (const producto of productos) {
            insertar.run({
                id: String(producto.id),
                titulo: producto.title,
                precio: parseFloat(producto.variants[0].price),
                stock: producto.variants[0].inventory_quantity ?? 0,
                imagen: producto.images?.[0]?.src ?? ""
            })
            total++
        }

        console.log(`✅ ${productos.length} productos guardados de ${handle}`)
    }

    console.log(`🎉 Sincronización completa: ${total} productos en total`)
}

// Colecciones a sincronizar
sincronizar([
    "bajaj-pulsar-180"
])