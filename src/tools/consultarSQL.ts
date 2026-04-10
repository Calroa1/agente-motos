import db from "../database/db.js"

export const consultarSQLTool = {
    definition: {
        type: "function" as const,
        function: {
            name: "consultarSQL",
            description: "Consulta precio e imagen de un repuesto específico por su nombre. Úsala cuando ya sabes qué producto es y necesitas su precio actual e imagen.",
            parameters: {
                type: "object",
                properties: {
                    titulo: {
                        type: "string",
                        description: "Nombre o parte del nombre del producto. Ejemplo: Filtro de Aire Pulsar 180"
                    }
                },
                required: ["titulo"]
            }
        }
    },

    execute: async (argumentos: { titulo: string }) => {
        const productos = db.prepare(`
            SELECT titulo, precio, imagen
            FROM productos
            WHERE titulo LIKE ?
            LIMIT 3
        `).all(`%${argumentos.titulo}%`) as { titulo: string, precio: number, imagen: string }[]

        if (!productos.length) {
            return { mensaje: "No encontré ese producto en la base de datos." }
        }

        return {
            resultados: productos.map(p => ({
                titulo: p.titulo,
                precio: `$${p.precio.toLocaleString("es-CO")} COP`,
                imagen: p.imagen
            }))
        }
    }
}