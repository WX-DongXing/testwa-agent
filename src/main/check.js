import path from 'path'
import childProcess from 'child_process'
import is from 'electron-util';

let exec = childProcess.exec

async function check () {
  return {
    env: {
      node: {
        name: 'Node',
        version: String(await checkNormal('node -v')).split('v')[1],
        path: String(await checkNormal(`${!is.windows ? 'which' : 'where'} node`))
      },
      java: {
        name: 'Java',
        version: new RegExp('\\"(.*?)\\"').exec(await checkNormal('java -version'))[1],
        path: String(await checkNormal(`${!is.windows ? 'which' : 'where'} java`))
      },
      python: {
        name: 'Python',
        version: String(await checkAbnormal('python --version')).split(' ')[1],
        path: String(await checkNormal(`${!is.windows ? 'which' : 'where'} python`))
      },
      adb: {
        name: 'Android adb',
        version: String(await checkNormal('adb version')).split(' ')[4].split('\n')[0],
        path: String(await checkNormal(`${!is.windows ? 'which' : 'where'} adb`))
      },
      sdk: {
        name: 'Android SDK',
        version: '???',
        path: String(await checkNormal(`${!is.windows ? 'which' : 'where'} adb`)).split('/platform-tools/adb')[0]
      }
    }
  }
}

async function checkNormal (cl) {
  try {
    return await openShell(cl)
  } catch (e) {
    return e
  }
}

async function checkAbnormal (cl) {
  try {
    return await openShell(cl)
  } catch (e) {
    return e
  }
}

function openShell (cl) {
  return new Promise((resolve, reject) => {
    exec(cl, {encoding: 'utf8', cwd: path.join(__dirname)}, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else if (stdout) {
        resolve(stdout)
      } else {
        reject(stderr)
      }
    })
  })
}

export default check