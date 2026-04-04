import * as dotenv from "dotenv"
import * as readline from "readline"
import { procesarMensaje } from "../agent/agent.js"
import { obtenerSesion, agregarMensaje } from "../memory/session.js"
import { systemPrompt } from "../agent/systemPrompt.js"

dotenv.config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const preguntar = (texto: string): Promise<string> => {
  return new Promise((resolve) => rl.question(texto, resolve))
}

const userId = "terminal"
const messages = obtenerSesion(userId, systemPrompt)

console.log("🏍️  Asistente de repuestos de motos")
console.log("Escribe 'salir' para terminar\n")

while (true) {
  const input = await preguntar("Tú: ")

  if (input.toLowerCase() === "salir") {
    console.log("¡Hasta luego!")
    rl.close()
    break
  }

  agregarMensaje(userId, { role: "user", content: input })
  const messages = obtenerSesion(userId, systemPrompt)
  const respuesta = await procesarMensaje(userId, messages)
  console.log(`\nAsistente: ${respuesta}\n`)
}