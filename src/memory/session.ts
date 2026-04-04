type Mensaje = {
  role: "system" | "user" | "assistant" | "tool"
  content: string | null
  tool_calls?: any[]
  tool_call_id?: string
}

// Cada usuario tiene su propia memoria identificada por su ID
const sesiones: Record<string, Mensaje[]> = {}

export const obtenerSesion = (userId: string, systemPrompt: Mensaje): Mensaje[] => {
  if (!sesiones[userId]) {
    sesiones[userId] = [systemPrompt]
  }
  return sesiones[userId]
}

export const agregarMensaje = (userId: string, mensaje: Mensaje) => {
  if (sesiones[userId]) {
    sesiones[userId].push(mensaje)
  }
}

export const limpiarSesion = (userId: string) => {
  delete sesiones[userId]
}