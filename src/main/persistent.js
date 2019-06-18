import path from 'path'
import { setEnv } from './db';
import { check_env } from './spawn'
import { map } from 'rxjs/operators'

export default function persistent() {

  function isExist (target, handle) {
    return target ? handle : ''
  }

  return check_env().pipe(map(envs => {
    let default_env = {
      node: {
        version: '',
        path: ''
      },
      java: {
        version: '',
        path: ''
      },
      python: {
        version: '',
        path: ''
      },
      adb: {
        version: '',
        path: ''
      },
      sdk: {
        version: '',
        path: ''
      }
    }
    envs.filter((value, index) => index % 2 !== 0)
      .forEach(env => {
        default_env[env.name.split('.')[0]].path = env.value.split('\n')[0]
      })
    default_env.node.version = isExist(envs[0].value, envs[0].value.split('v')[1])
    default_env.java.version = isExist(envs[2].value, new RegExp('\\"(.*?)\\"').exec(envs[2].value) ? new RegExp('\\"(.*?)\\"').exec(envs[2].value)[1] : '')
    default_env.python.version = isExist(envs[4].value,new RegExp('[2-3].[0-9].([0-9]|1[0-9])').exec(envs[4].value) ? new RegExp('[2-3].[0-9].([0-9]|1[0-9])').exec(envs[4].value)[0] : '')
    default_env.adb.version = isExist(envs[6].value, envs[6].value.split('\n')[0].split(' ')[4])
    default_env.sdk.version = ''
    default_env.sdk.path = isExist(envs[7].value, path.resolve(envs[7].value, '..', '..'))
    for (let [k, v] of Object.entries(default_env)) {
      setEnv(k, v.version, v.path)
    }
  }))
}
