import { buscarRepuestosTool } from "./buscarRepuestos.js"

// Aquí registras todas las tools
export const tools = [buscarRepuestosTool.definition]

// Mapa para ejecutar la tool correcta por nombre
const toolMap: Record<string, (args: any) => Promise<any>> = {
  buscarRepuestos: buscarRepuestosTool.execute
}

export const ejecutarTool = async (nombre: string, argumentos: any) => {
  const tool = toolMap[nombre]
  if (!tool) return { error: `Herramienta '${nombre}' no encontrada` }
  return await tool(argumentos)
}