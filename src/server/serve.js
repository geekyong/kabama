const Koa = require('koa')
const cors = require('koa2-cors')
const path = require('path')
const fs = require('fs')
const consola  = require('consola')
const app = new Koa()

app.use(cors({
  origin: '*',
  allowMethods: ['GET'],
  allowHeaders: ['Content-Type']
}))

const dir = path.join(__dirname, '../plugins')
function readDir (foldPath) {
  let allFiles = []
  const files = fs.readdirSync(foldPath)

  if (!files) {
    return
  }
  for (let f of files) {
    const stats = fs.statSync(path.join(foldPath, f))
    if (!stats) continue
    const thisPath = path.join(foldPath, f)
    if (stats.isDirectory()) {
      if (f === 'node_modules' || f === 'dist') {
        continue
      }
      const child = readDir(thisPath)

      allFiles = allFiles.concat(...child)
    } else {
      const data = fs.readFileSync(thisPath)
      if (!data) continue
      const reg = new RegExp('\\\\', 'g')
      allFiles.push({
        'path': thisPath.slice(thisPath.lastIndexOf(dir) + dir.length, thisPath.length).replace(reg, '/'),
        'data': data
      })
    }
  }
  return allFiles
}
const data = readDir(dir)
app.use(async (ctx, next) => {
  await next()

  if (!data) {
    return false
  }

  const paths = []
  for (let d of data) {
    paths.push(d.path)
  }

  if (ctx.request.path === '/') {
    let body = ''
    for (let p of paths) {
      body += `<br><a href="${p}">${p}</a></br>`
    }
    ctx.response.body = body
    return
  }
  ctx.response.type = 'text/plain'

  if (ctx.request.path === '/fileList') {
    ctx.response.body = paths
    return
  }

  for (let dict of data) {
    if (ctx.request.path === dict.path) {
      ctx.response.body = dict.data
    }
  }
})
const port = 3000
app.listen(port)
consola.success(`listening on ${port}`)
