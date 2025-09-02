let handler = async (m, { conn }) => {
  const textoDefinido = 'Este es el texto definido que se enviará junto al quoted.'

  // Si el comando se ejecuta dentro de un grupo, m.chat ya será el JID del grupo (xxxxx@g.us).
  // Si quieres forzar otro grupo, reemplaza groupJid por '123456789-123456@g.us'
  const groupJid = m.chat && m.chat.endsWith('@g.us') ? m.chat : '123456789-123456@g.us'

  global.ftag = {
    key: {
      fromMe: false,
      participant: m.sender,     // quien "aparece" como participante que envía el mensaje
      remoteJid: groupJid,      // JID del grupo para que se trate como mensaje de grupo
      id: 'KHRL-12345'          // id arbitraria (puedes generar una aleatoria)
    },
    // Usamos extendedTextMessage para que se vea como un mensaje de texto normal del grupo
    message: {
      extendedTextMessage: {
        text: 'Mensaje simulado proveniente del grupo.'
      }
    }
  }

  await conn.sendMessage(m.chat, { text: textoDefinido }, { quoted: global.ftag })
}

handler.command = /^msj$/i

export default handler






/* let handler = async (m, { conn }) => {
  const textoDefinido = 'Este es el texto definido que se enviará junto al quoted.'

  global.ftag = {
    key: {
      fromMe: false,
      participant: m.sender,
      remoteJid: m.chat,
      id: 'KHRL-12345'
    },
    message: {
      protocolMessage: {
        type: 'STATUS_MENTION_MESSAGE'
      }
    }
  }

  await conn.sendMessage(m.chat, { text: textoDefinido }, { quoted: global.ftag })
}

handler.command = /^msj$/i

export default handler */