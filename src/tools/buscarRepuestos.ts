export const buscarRepuestosTool = {
  definition: {
    type: "function" as const,
    function: {
      name: "buscarRepuestos",
      description: "Busca repuestos disponibles en el catálogo para una marca y modelo de moto específico",
      parameters: {
        type: "object",
        properties: {
          marca: {
            type: "string",
            description: "Marca de la moto en minúsculas. Ejemplo: bajaj, honda, yamaha, akt, hero, suzuki"
          },
          modelo: {
            type: "string",
            description: "Modelo de la moto con guiones. Ejemplo: pulsar-180, cb-160, fz16, boxer-150"
          }
        },
        required: ["marca", "modelo"]
      }
    }
  },

  execute: async (argumentos: { marca: string, modelo: string }) => {
    const { marca, modelo } = argumentos
    const url = `https://mundimotos.com/collections/${marca}-${modelo}/products.json?limit=8`

    try {
      const response = await fetch(url)
      const data = await response.json() as any

      if (!data.products || data.products.length === 0) {
        return { mensaje: "No se encontraron productos para este modelo." }
      }

      const productos = data.products.map((p: any) => ({
        nombre: p.title,
        precio: `$${(p.variants[0].price * 1).toLocaleString("es-CO")} COP`
      }))

      return { marca, modelo, productos }

    } catch (error) {
      return { error: "Error al consultar el catálogo" }
    }
  }
}