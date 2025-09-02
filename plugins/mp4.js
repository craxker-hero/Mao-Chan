let handler = async (m, { conn }) => {
  const textoDefinido = '@everyone Hola 😀'

  // JID del grupo (si usas el mismo grupo desde el que mandas el comando, es m.chat)
  const groupJid = m.chat.endsWith('@g.us') ? m.chat : '123456789-123456@g.us'

  global.ftag = {
    key: {
      fromMe: false,
      participant: m.sender,
      remoteJid: groupJid,
      id: 'GRP-12345'
    },
    message: {
      extendedTextMessage: {
        text: 'Grupo • S.C.A | StarCore', // aquí pones el nombre que quieres que muestre arriba
        contextInfo: {
          mentionedJid: [groupJid] // esto hace que se vea como “etiqueta al grupo”
        }
      }
    }
  }

  await conn.sendMessage(
    m.chat,
    { text: textoDefinido, mentions: [groupJid] },
    { quoted: global.ftag }
  )
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