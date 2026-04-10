import { buscarRepuestosSemantic } from "../rag/buscar.js"
import db from "../database/db.js"

export const buscarSemanticTool = {
    definition: {
        type: "function" as const,
        function: {
            name: "buscarSemantic",
            description: "Busca repuestos por compatibilidad, descripción o problema en lenguaje natural. Úsala cuando el usuario describa un problema o pregunte por compatibilidad.",
            parameters: {
                type: "object",
                properties: {
                    pregunta: {
                        type: "string",
                        description: "La pregunta o descripción del usuario. Ejemplo: se me daño el clutch de la pulsar"
                    }
                },
                required: ["pregunta"]
            }
        }
    },

    execute: async (argumentos: { pregunta: string }) => {
        const resultados = await buscarRepuestosSemantic(argumentos.pregunta)

        if (!resultados.length) {
            return { mensaje: "No encontré repuestos relacionados con tu consulta." }
        }

        const productosConPrecio = resultados.map(r => {
            const id = r.metadata.id as string
            const enSQL = db.prepare("SELECT precio, imagen FROM productos WHERE id = ?").get(id) as { precio: number, imagen: string } | undefined

            return {
                titulo: r.metadata.titulo,
                descripcion: r.texto,
                precio: enSQL ? `$${enSQL.precio.toLocaleString("es-CO")} COP` : "consulta disponibilidad con nuestro asesor",
                imagen: enSQL?.imagen ?? ""
            }
        })

        return { resultados: productosConPrecio }
    }
}