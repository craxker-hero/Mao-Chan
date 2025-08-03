import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

const tags = {
  serbot: '🌐 SUBBOTS',
  eco: '💸 ECONOMÍA',
  downloader: '⬇️ DESCARGAS',
  tools: '🛠️ HERRAMIENTAS',
  owner: '👑 PROPIETARIO',
  info: 'ℹ️ INFORMACIÓN',
  game: '🎮 JUEGOS',
  gacha: '🎲 GACHA ANIME',
  group: '👥 GRUPOS',
  search: '🔎 BUSCADORES',
  sticker: '📌 STICKERS',
  ia: '🤖 IA',
  channel: '📺 CANALES',
  fun: '😂 DIVERSIÓN',
}

const emojis = {
  serbot: '🌐',
  eco: '💸',
  downloader: '⬇️',
  tools: '🛠️',
  owner: '👑',
  info: 'ℹ️',
  game: '🎮',
  gacha: '🎲',
  group: '👥',
  search: '🔎',
  sticker: '📌',
  ia: '🤖',
  channel: '📺',
  fun: '😂',
}

const owner = '59897246324@s.whatsapp.net'
const ownerMention = owner.split('@')[0]

let estilo = (text, style = 1) => {
  const xStr = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('')
  const yStr = Object.freeze({
    1: ['𝖺','𝖻','𝖼','𝖽','𝖾','𝖿','𝗀','𝗁','𝗂','𝗃','𝗄','𝗅','𝗆','𝗇','𝗈','𝗉','𝗊','𝗋','𝗌','𝗍','𝗎','𝗏','𝗐','𝗑','𝗒','𝗓','1','2','3','4','5','6','7','8','9','0']
  })
  return text
    .toLowerCase()
    .split('')
    .map(ch => {
      const idx = xStr.indexOf(ch)
      return idx !== -1 ? yStr[style][idx] : ch
    })
    .join('')
}

const defaultMenu = {
  before: `
> 👋 Hola %taguser, %greeting

» 𝖥𝖾𝖼𝗁𝖺 : %date
» 𝖬𝗈𝖽𝗈 : Público
» 𝖱𝗎𝗇 : [%uptime]
» 𝖢𝗋𝖾𝖺𝖽𝗈𝗋 : @${ownerMention}
» 𝖯𝗋𝖾𝖿𝗂𝗑 : ( ! . / )
» 𝖢𝗈𝗆𝖺𝗇𝖽𝗈𝗌 : %totalf
» 𝖡𝗈𝗍 𝖵𝖾𝗋𝗌𝗂𝗈𝗇 : 1.0.0-beta

%readmore`.trimStart(),
  header: '\n*%emoji  %category* 💚',
  body: '> %emoji  %cmd %islimit %isPremium',
  footer: '',
  after: '\n✨ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖡𝗒 𝖠𝖽𝗈.',
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  const { exp, limit, level } = global.db.data.users[m.sender]
  const { min, xp, max } = xpRange(level, global.multiplier)
  const name = await conn.getName(m.sender)

  const totalf = Object.values(global.plugins)
    .reduce((t, p) => t + (Array.isArray(p.command) ? p.command.length : p.command ? 1 : 0), 0)

  const d = new Date(Date.now() + 3600000)
  const locale = 'es'
  const date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })

  const help = Object.values(global.plugins)
    .filter(p => !p.disabled)
    .map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      limit: plugin.limit,
      premium: plugin.premium,
    }))

  let nombreBot = global.namebot || 'Bot'
  let bannerFinal = 'https://iili.io/FrbNIr7.jpg'
  const botActual = conn.user?.jid.split('@')[0].replace(/\D/g, '')
  const configPath = join('./JadiBots', botActual, 'config.json')
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath))
      if (cfg.name) nombreBot = cfg.name
      if (cfg.banner) bannerFinal = cfg.banner
    } catch {}
  }
  const tipo = botActual === '+50493059810'.replace(/\D/g, '') ? 'Principal 🪴' : 'Sub Bot 🍃'

  const menuConfig = conn.menu || defaultMenu

  const _text = [
    menuConfig.before,
    ...Object.keys(tags).map(tag => {
      const icon = emojis[tag] || ''
      const title = tags[tag]
      const h = menuConfig.header
        .replace(/%emoji/g, icon)
        .replace(/%category/g, title)
      const b = help
        .filter(menu => menu.tags.includes(tag))
        .map(menu =>
          menu.help.map(cmd =>
            menuConfig.body
              .replace(/%emoji/g, icon)
              .replace(/%cmd/g, menu.prefix ? cmd : `${_p}${cmd}`)
              .replace(/%islimit/g, menu.limit ? '◜⭐◞' : '')
              .replace(/%isPremium/g, menu.premium ? '◜🪪◞' : '')
              .trim()
          ).join('\n')
        ).join('\n')
      return [h, b, menuConfig.footer].join('\n')
    }),
    menuConfig.after
  ].join('\n')

  const replace = {
    '%': '%', p: _p, botname: nombreBot,
    taguser: '@' + m.sender.split('@')[0],
    exp: exp - min, maxexp: xp, totalexp: exp, xp4levelup: max - exp,
    level, limit, name, totalf, date,
    uptime: clockString(process.uptime() * 1000),
    tipo, readmore: readMore, greeting
  }
  const text = _text.replace(
    new RegExp(`%(${Object.keys(replace).sort((a,b)=>b.length-a.length).join('|')})`, 'g'),
    (_, name) => String(replace[name])
  )

  await conn.sendMessage(
    m.chat,
    {
      text: estilo(text),
      mentions: [m.sender, owner],
      contextInfo: {
        externalAdReply: {
          title: nombreBot,
          body: 'Bot ultra',
          thumbnailUrl: bannerFinal,
          sourceUrl: 'https://whatsapp.com/channel/0029VbArz9fAO7RGy2915k3O',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: m }
  )
}

handler.command = ['menu', 'help', 'menú']
handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms/3600000)
  const m = isNaN(ms) ? '--' : Math.floor(ms/60000)%60
  const s = isNaN(ms) ? '--' : Math.floor(ms/1000)%60
  return [h,m,s].map(v=>v.toString().padStart(2,'0')).join(':')
}

const ase = new Date()
const hour = ase.getHours()
const greetingMap = {
  0:'una linda noche 🌙',1:'una linda noche 💤',2:'una linda noche 🦉',
  3:'una linda mañana ✨',4:'una linda mañana 💫',5:'una linda mañana 🌅',
  6:'una linda mañana 🌄',7:'una linda mañana 🌅',8:'una linda mañana 💫',
  9:'una linda mañana ✨',10:'un lindo día 🌞',11:'un lindo día 🌨',
 12:'un lindo día ❄',13:'un lindo día 🌤',14:'una linda tarde 🌇',
 15:'una linda tarde 🥀',16:'una linda tarde 🌹',17:'una linda tarde 🌆',
 18:'una linda noche 🌙',19:'una linda noche 🌃',20:'una linda noche 🌌',
 21:'una linda noche 🌃',22:'una linda noche 🌙',23:'una linda noche 🌃',
}
const greeting = 'espero que tengas ' + (greetingMap[hour] || 'un buen día')