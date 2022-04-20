const express = require('express')
const qrcode = require('qrcode-terminal')
const fs = require('fs')

const cors = require('cors')
const app = express()

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js')

const client = new Client({
   authStrategy: new LocalAuth(),
   puppeteer: {
      executablePath: '/usr/bin/chromium-browser',
   },
})

client.on('qr', (qr) => {
   qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
   console.log('Client is ready!')
})

client.on('message', async (message) => {
   console.log(message.body)
   if (message.body === '/help') {
      fs.readFile('./commands/help.txt', function (err, buf) {
         message.reply(buf.toString())
      })
   } else if (message.body === '/salas') {
      fs.readFile('./commands/salas.txt', function (err, buf) {
         message.reply(buf.toString())
      })
   } else if (message.body === '/provas') {
      fs.readFile('./commands/provas.txt', function (err, buf) {
         message.reply(buf.toString())
      })
   } else if (message.body === '/thiago') {
      const sticker = MessageMedia.fromFilePath('./img/thiago.png')
      client.sendMessage(message.from, sticker, { sendMediaAsSticker: true })
   } else if (message.body === '/horarios') {
      const media = MessageMedia.fromFilePath('./img/horarios.jpeg')
      message.reply(media)
   } else if (message.body === '/horario2') {
      const media = MessageMedia.fromFilePath('./img/horario2.png')
      message.reply(media)
   } else if (message.body === '/sticker') {
      if (message.hasMedia) {
         const media = await message.downloadMedia()
         client.sendMessage(message.from, media, { sendMediaAsSticker: true })
      } else {
         client.sendMessage(message.from, '```(warning) Envie o comando anexado a uma imagem.```')
      }
   }
})

app.use(cors())
app.use(express.json())

app.get('/provas', (req, res) => {
   fs.readFile('./commands/provas.txt', function (err, buf) {
      res.send(buf.toString())
   })
})

app.post('/provas', (req, res) => {
   const { update } = req.body

   fs.writeFile('./commands/provas.txt', update, () => {
      console.log('(success) the command "/provas" has been updated')
      res.send(true)
   })
})

app.listen(5555, () => {
   console.log('backend running on PORT: 5555')
})

client.initialize()
