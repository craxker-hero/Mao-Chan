let handler = async (m, { conn }) => {
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

export default handler