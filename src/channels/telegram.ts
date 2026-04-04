import TelegramBot from "node-telegram-bot-api"
import * as dotenv from "dotenv"
import { procesarMensaje } from "../agent/agent.js"
import { obtenerSesion, agregarMensaje } from "../memory/session.js"
import { systemPrompt } from "../agent/systemPrompt.js"

dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true })

console.log("🤖 Bot de Telegram iniciado...")

bot.on("message", async (msg) => {
  const chatId = msg.chat.id
  const userId = String(chatId)
  const texto = msg.text

  if (!texto) return

  // Comando para limpiar la conversación
  if (texto === "/start" || texto === "/nuevo") {
    const { limpiarSesion } = await import("../memory/session.js")
    limpiarSesion(userId)
    bot.sendMessage(chatId, "🏍️ ¡Hola! Soy tu asistente de repuestos de motos. ¿En qué te puedo ayudar?")
    return
  }

  bot.sendChatAction(chatId, "typing")

  // Obtiene o crea la memoria del usuario
  const messages = obtenerSesion(userId, systemPrompt)
  agregarMensaje(userId, { role: "user", content: texto })

  const respuesta = await procesarMensaje(userId, messages)

  bot.sendMessage(chatId, respuesta)
})

bot.on("polling_error", (error) => {
  console.error("❌ Error de polling:", error.message)
})