const Jimp = require('jimp')
const {listFiles} = require('list-files-in-dir')
const pngToIco = require('png-to-ico')
const fs = require('fs')

class Converter {
  constructor (options = {}) {
    this._mobilePath = options.mobilePath
    this._saveIn = options.saveIn
    this._sourceImg = options.sourceImg
    this._mobile = options.mobile
  }

  async convert () {
    await this._convertLogos()

    if (this._mobile) {
      await this._convertMobile()
    }
  }

  async _convertLogos () {
    const icon = await Jimp.read(this._sourceImg)
    await Promise.all([
      icon.contain(192, 192).writeAsync(`${this._saveIn}/logo192.png`),
      icon.contain(512, 512).writeAsync(`${this._saveIn}/logo512.png`),
    ])

    const buf = await pngToIco(this._sourceImg)
    await fs.promises.writeFile(`${this._saveIn}/favicon.ico`, buf)
  }

  async _convertMobile () {
    this._fileList = await listFiles(this._mobilePath)

    for (const iconPath of this._fileList) {
      const [height, width] = await Jimp.read(iconPath).then(icon => {
        return [icon.bitmap.height, icon.bitmap.width]
      })

      await Jimp.read(this._sourceImg).then(icon => {
        return icon.contain(width, height).writeAsync(iconPath)
      })

      console.log('Convert to ', height, 'x', width, ', save in ', iconPath)
    }
  }
}

module.exports = {
  convertImages (options) {
    return new Converter(options).convert()
  },
}
