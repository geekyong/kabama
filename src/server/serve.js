const Koa = require('koa')
const cors = require('koa2-cors')
const path = require('path')
const fs = require('fs')
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
console.log(data)
app.use(async (ctx, next) => {
  await next()

  if (!data) {
    return false
  }
  ctx.response.type = 'text/plain'

  if (ctx.request.path === '/fileList') {
    const paths = []
    for (let d of data) {
      paths.push(d.path)
    }
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
console.log(`listen on ${port}`)
