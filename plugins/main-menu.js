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
const creatorNumber = '59897246324'

let estilo = (text, style = 1) => {
  var xStr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0']
  var yStr = Object.freeze({
    1: ['𝖺','𝖻','𝖼','𝖽','𝖾','𝖿','𝗀','𝗁','𝗂','𝗃','𝗄','𝗅','𝗆','𝗇','𝗈','𝗉','𝗊','𝗋','𝗌','𝗍','𝗎','𝗏','𝗐','𝗑','𝗒','𝗓','1','2','3','4','5','6','7','8','9','0']
  })

  var replacer = []
  xStr.map((v, i) => replacer.push({
    original: v,
    convert: yStr[style][i]
  }))
  var str = text.toLowerCase().split('')
  var output = []
  str.map(v => {
    const find = replacer.find(x => x.original == v)
    find ? output.push(find.convert) : output.push(v)
  })
  return output.join('')
}
const defaultMenu = {
  before: `
ㅤᨦ۪۪۪۪ׄ᷼ㅤ֢ㅤׄㅤׅ֟፝ㅤ⋱ㅤ⁝ㅤ⋰ㅤׅ፝֟ㅤׄㅤ֢ㅤ۪۪۪۪ׄ᷼ഒ
   Ꮚ  ׅ  *%greeting*  ৎ୭
       ׅ ෫%taguser ಒ

𓊪 𛄅⵿۫۫〬🌴𔗄 Nombre : %name
𓊪 𛄅⵿۫۫〬🌱𔗄 Run : [%uptime]
𓊪 𛄅⵿۫۫〬🌾𔗄 Owner : @${ownerMention}
𓊪 𛄅⵿۫۫〬🌷𔗄 Prefix : ( ! . / )
𓊪 𛄅⵿۫۫〬🌿𔗄 Comandos : %totalf
𓊪 𛄅⵿۫۫〬🎍𔗄 Versión : 1.0.0-beta
%readmore`.trimStart(),
  header: '*%category*',
  body: '°𓃉𐇽ܳ𓏸%emojiᮬᩬִּ〫᪲۟. %cmd %islimit %isPremium',
  footer: '',
  after: '\n✨ 𝖢𝗋𝖾𝖺𝗍𝖾𝖽 𝖡𝗒 𝖠𝖽𝗈.',
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const { exp, limit, level } = global.db.data.users[m.sender]
    const { min, xp, max } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const totalf = Object.values(global.plugins).reduce((total, plugin) => {
      if (plugin.command) {
        if (Array.isArray(plugin.command)) {
          return total + plugin.command.length
        } else {
          return total + 1
        }
      }
      return total
    }, 0)

    const d = new Date(Date.now() + 3600000)
    const locale = 'es'
    const date = d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

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

    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const configPath = join('./JadiBots', botActual, 'config.json')

    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath))
        if (config.name) nombreBot = config.name
        if (config.banner) bannerFinal = config.banner
      } catch (err) {}
    }

    const tipo = botActual === '+50493059810'.replace(/\D/g, '')
      ? 'Principal 🪴'
      : 'Sub Bot 🍃'

    const menuConfig = conn.menu || defaultMenu

    const _text = [
      menuConfig.before,
      ...Object.keys(tags).map(tag => {
        const icon = emojis[tag] || ''
        const title = tags[tag]
        const h = menuConfig.header
          .replace(/%emoji/g, icon)
          .replace(/%category/g, title)
        const b = help.filter(menu => menu.tags?.includes(tag)).map(menu =>
          menu.help.map(helpText =>
            menuConfig.body
              .replace(/%emoji/g, icon)
              .replace(/%cmd/g, menu.prefix ? helpText : `${_p}${helpText}`)
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
      '%': '%',
      p: _p,
      botname: nombreBot,
      taguser: '@' + m.sender.split('@')[0],
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - xp,
      level,
      limit,
      name,
      totalf,
      date,
      uptime: clockString(process.uptime() * 1000),
      tipo,
      readmore: readMore,
      greeting,
    }

    const text = _text.replace(
      new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'),
      (_, name) => String(replace[name])
    )

    const isURL = typeof bannerFinal === 'string' && /^https?:\/\//i.test(bannerFinal)
    const imageContent = isURL
      ? { image: { url: bannerFinal } }
      : { image: fs.readFileSync(bannerFinal) }

    await conn.sendMessage(m.chat, {
      text: estilo(text),
      mentions: [m.sender, owner],
      contextInfo: {
        externalAdReply: {
          title: nombreBot,
          body: `${date}`,
          thumbnailUrl: bannerFinal,
          sourceUrl: 'https://whatsapp.com/channel/0029VbArz9fAO7RGy2915k3O',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
  } catch (e) {
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m)
  }
}

handler.command = ['menu', 'help', 'menú']
handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

const ase = new Date()
let hour = ase.getHours()

const greetingMap = {
  0: 'buenas noches 🌙',  1: 'buenas noches 🌙',  2: 'buenas noches 🌙',
  3: 'buenas noches 🌙',  4: 'buenas noches 🌙',  5: 'buenas noches 🌙',
  6: 'buenos días 🌞',    7: 'buenos días 🌞',    8: 'buenos días 🌞',
  9: 'buenos días 🌞',   10: 'buenos días 🌞',   11: 'buenos días 🌞',
  12: 'buenas tardes 🌅', 13: 'buenas tardes 🌅', 14: 'buenas tardes 🌅',
  15: 'buenas tardes 🌅', 16: 'buenas tardes 🌅', 17: 'buenas tardes 🌅',
  18: 'buenas noches 🌙', 19: 'buenas noches 🌙', 20: 'buenas noches 🌙',
  21: 'buenas noches 🌙', 22: 'buenas noches 🌙', 23: 'buenas noches 🌙',
}

var greeting = greetingMap[hour] || 'un buen día';


/* const greetingMap = {
  0: 'una linda noche 🌙', 1: 'una linda noche 💤', 2: 'una linda noche 🦉',
  3: 'una linda mañana ✨', 4: 'una linda mañana 💫', 5: 'una linda mañana 🌅',
  6: 'una linda mañana 🌄', 7: 'una linda mañana 🌅', 8: 'una linda mañana 💫',
  9: 'una linda mañana ✨', 10: 'un lindo día 🌞', 11: 'un lindo día 🌨',
  12: 'un lindo día ❄', 13: 'un lindo día 🌤', 14: 'una linda tarde 🌇',
  15: 'una linda tarde 🥀', 16: 'una linda tarde 🌹', 17: 'una linda tarde 🌆',
  18: 'una linda noche 🌙', 19: 'una linda noche 🌃', 20: 'una linda noche 🌌',
  21: 'una linda noche 🌃', 22: 'una linda noche 🌙', 23: 'una linda noche 🌃',
}
var greeting = 'espero que tengas ' + (greetingMap[hour] || 'un buen día') */