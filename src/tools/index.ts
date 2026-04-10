import { buscarRepuestosTool } from "./buscarRepuestos.js"
import { buscarSemanticTool } from "./buscarSemantic.js"
import { consultarSQLTool } from "./consultarSQL.js"

export const tools = [
    buscarRepuestosTool.definition,
    buscarSemanticTool.definition,
    consultarSQLTool.definition
]

const toolMap: Record<string, (args: any) => Promise<any>> = {
    buscarRepuestos: buscarRepuestosTool.execute,
    buscarSemantic: buscarSemanticTool.execute,
    consultarSQL: consultarSQLTool.execute
}

export const ejecutarTool = async (nombre: string, argumentos: any) => {
    const tool = toolMap[nombre]
    if (!tool) return { error: `Herramienta '${nombre}' no encontrada` }
    return await tool(argumentos)
}