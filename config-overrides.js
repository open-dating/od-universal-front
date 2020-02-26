const fsExtra = require('fs-extra')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const {spawnSync} = require('child_process')

const pkg = require('./package')
const {convertImages} = require('./convertImages')

if (!process.env.REACT_APP_GIT_LAST_COMMIT) {
  const out = spawnSync('git', ['log', '--format=%H', '-n', '1'])
  process.env.REACT_APP_GIT_LAST_COMMIT = out.stdout.toString()
}
process.env['REACT_APP_GIT_BRANCH'] = process.env['REACT_APP_GIT_BRANCH'] || 'master'
process.env['REACT_APP_VERSION_CODE'] = `${pkg.version}`
process.env['REACT_APP_NAME'] = `${pkg.name}`
process.env['REACT_APP_LAST_BUILD'] = new Date().toUTCString()

process.env['REACT_APP_FULL_VERSION'] = `${pkg.version}:${process.env.REACT_APP_GIT_BRANCH}:${process.env.REACT_APP_GIT_LAST_COMMIT}`

console.log('REACT_APP_HOST=', process.env['REACT_APP_HOST'])
console.log('REACT_APP_FULL_VERSION=', process.env['REACT_APP_FULL_VERSION'])

console.warn(`For mobile development you need go to https://console.firebase.google.com/
create project, get Cloud Messaging config files and save as:
google-services.json
GoogleService-Info.plist
for send and recieve pushes`)

/**
 * @help https://github.com/timarney/react-app-rewired/tree/f81e1f482a644ca7baff752776adafeb760cf5da#extended-configuration-options
 * @param config
 * @param env
 * @returns {*}
 */
module.exports = function override(config, env) {
  if (process.env.REACT_APP_CORDOVA) {
    config.optimization.minimize = false
    config.output.publicPath = '' // 'file:///android_asset/www/'
    config.plugins.push(
      new HtmlWebpackTagsPlugin({
        tags: ['cordova.js'],
        append: false,
      }),
    )
  }

  return config
}

process.on('beforeExit', async (code) => {
  if (code > 0) {
    process.exit(code)
  }

  if (process.env.NODE_ENV !== 'production') {
    process.exit(0)
  }

  await convertImages({
    sourceImg: `${__dirname}/build/logo.png`,
    saveIn: `${__dirname}/build`,
    mobilePath: `${__dirname}/build/res`,
    mobile: process.env.REACT_APP_CORDOVA,
  })

  if (process.env.REACT_APP_CORDOVA) {
    fsExtra.emptyDirSync(__dirname + '/www')
    fsExtra.copySync(__dirname + '/build', __dirname + '/www')
    console.log(`Copied files to ${__dirname + '/www'}`)
  }

  process.exit(0)
})
