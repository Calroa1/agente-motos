import { buscarRepuestosSemantic } from "../rag/buscar.js"

export const buscarSemanticTool = {
  definition: {
    type: "function" as const,
    function: {
      name: "buscarSemantic",
      description: "Busca repuestos por compatibilidad, descripción o pregunta en lenguaje natural. Úsala cuando el usuario pregunta si un repuesto sirve para su moto, o describe un problema sin saber el nombre exacto del repuesto.",
      parameters: {
        type: "object",
        properties: {
          pregunta: {
            type: "string",
            description: "La pregunta o descripción del usuario en lenguaje natural. Ejemplo: ¿el filtro de aire de pulsar 180 sirve para pulsar 200?"
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

    return {
      resultados: resultados.map(r => ({
        nombre: r.metadata.titulo,
        precio: `$${Number(r.metadata.precio).toLocaleString("es-CO")} COP`,
        url: r.metadata.url
      }))
    }
  }
}