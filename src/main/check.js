import path from 'path'
import childProcess from 'child_process'
import is from 'electron-util';

let exec = childProcess.exec

function isFindVersion(pre, cur) {
  return pre ? cur : pre
}

async function checkCl (cl) {
  try {
    return String(await openShell(cl))
  } catch (error) {
    console.log(error)
  }
  return ''

}

function openShell (cl) {
  return new Promise((resolve, reject) => {
    exec(cl, {encoding: 'utf8', cwd: path.join(__static)}, (err, stdout, stderr) => {
      if (err) {
        reject(err)
      } else {
        resolve(stdout || stderr)
      }
    })
  })
}

async function check () {
  let node_v, node_p, java_v, java_p, python_v, python_p, adb_p
  node_v = isFindVersion(await checkCl('node -v'), String(await checkCl('node -v')).split('v')[1])
  node_p = await checkCl(`${!is.windows ? 'which' : 'where'} node`)
  java_v = isFindVersion(await checkCl('java -version'), new RegExp('\\"(.*?)\\"').exec(await checkCl('java -version'))[1])
  java_p = await checkCl(`${!is.windows ? 'which' : 'where'} java`)
  python_v = isFindVersion(await checkCl('python --version'), String(await checkCl('python --version')).split(' ')[1])
  python_p = await checkCl(`${!is.windows ? 'which' : 'where'} python`)
  adb_p = await checkCl(`${!is.windows ? 'which' : 'where'} adb`)

  return {
    env: {
      node: {
        name: 'Node',
        version: node_v,
        path: node_p
      },
      java: {
        name: 'Java',
        version: java_v,
        path: java_p
      },
      python: {
        name: 'Python',
        version: python_v,
        path: python_p
      },
      adb: {
        name: 'Android adb',
        version: await checkCl('adb version') ? String(await checkCl('adb version')).split(' ')[4].split('\n')[0] : '',
        path: adb_p
      },
      sdk: {
        name: 'Android SDK',
        version: '',
        path: adb_p ? adb_p.split('/platform-tools/adb')[0] : ''
      }
    }
  }
}

export default check