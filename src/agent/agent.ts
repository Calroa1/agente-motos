import Groq from "groq-sdk"
import * as dotenv from "dotenv"
import { tools, ejecutarTool } from "../tools/index.js"
import { agregarMensaje } from "../memory/session.js"

dotenv.config()

type Mensaje = {
  role: "system" | "user" | "assistant" | "tool"
  content: string | null
  tool_calls?: any[]
  tool_call_id?: string
}

export const procesarMensaje = async (
  userId: string,
  messages: Mensaje[]
): Promise<string> => {

  // Cliente se crea dentro de la función — dotenv ya cargó
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  try {
    const respuesta = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      tools
    })

    const mensaje = respuesta.choices[0].message

    if (mensaje.tool_calls && mensaje.tool_calls.length > 0) {
      const toolCall = mensaje.tool_calls[0]
      const nombreTool = toolCall.function.name
      const argumentos = JSON.parse(toolCall.function.arguments)

      console.log(`🔧 [${userId}] Usando herramienta: ${nombreTool}`)

      const resultado = await ejecutarTool(nombreTool, argumentos)

      agregarMensaje(userId, {
        role: "assistant",
        content: null,
        tool_calls: mensaje.tool_calls
      })
      agregarMensaje(userId, {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(resultado)
      })

      const respuestaFinal = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [...messages, {
          role: "assistant" as const,
          content: null,
          tool_calls: mensaje.tool_calls
        }, {
          role: "tool" as const,
          tool_call_id: toolCall.id,
          content: JSON.stringify(resultado)
        }]
      })

      const textoFinal = respuestaFinal.choices[0].message.content ?? ""
      agregarMensaje(userId, { role: "assistant", content: textoFinal })
      return textoFinal

    } else {
      const textoRespuesta = mensaje.content ?? ""
      agregarMensaje(userId, { role: "assistant", content: textoRespuesta })
      return textoRespuesta
    }

  } catch (error) {
    console.error(`❌ Error en agente [${userId}]:`, error)
    return "Lo siento, ocurrió un error. Por favor intenta de nuevo."
  }
}