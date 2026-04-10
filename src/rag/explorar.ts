import "dotenv/config"

const respuesta = await fetch("https://mundimotos.com/collections/bajaj-pulsar-180/products.json")
const data = await respuesta.json() as any

for (const producto of data.products) {
    console.log("─────────────────────────────────────")
    console.log("TITULO:      ", producto.title)
    console.log("TIPO:        ", producto.product_type)
    console.log("VENDOR:      ", producto.vendor)
    console.log("TAGS:        ", producto.tags)
    console.log("DESCRIPCION: ", producto.body_html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 100))
}