import defaultShell from 'spawn-default-shell'
import {fromEvent, merge, zip} from 'rxjs';
import { mapTo, map, first } from 'rxjs/operators'
import { is } from 'electron-util'

function spawn(name, command,  type) {
  let child = defaultShell.spawn(command)
  let child_stdout = fromEvent(child.stdout, 'data').pipe(map(v => { return { name: name, value: v.toString() } }))
  let child_stderr = type
    ? fromEvent(child.stderr, 'data').pipe(map(v => { return { name: name, value: v.toString() } }))
    : fromEvent(child.stderr, 'data').pipe(mapTo({ name: name, value: '' }))
  let child_err = fromEvent(child, 'error').pipe(mapTo({ name: name, value: '' }))
  let child_close = fromEvent(child, 'close').pipe(mapTo({ name: name, value: '' }))
  return merge(child_stdout, child_stderr, child_err, child_close).pipe(
    first()
  )
}

function check_env() {
  return zip(
    spawn('node.version', 'node -v'),
    spawn('node.path', is.windows ? 'where node' : 'which node'),
    spawn('java.version', 'java -version', true),
    spawn('java.path', is.windows ? 'where java' : 'which java'),
    spawn('python.version', 'python --version', true),
    spawn('python.path', is.windows ? 'where python' : 'which python', true),
    spawn('adb.version', 'adb version'),
    spawn('adb.path', is.windows ? 'where adb' : 'which adb')
  )
}

export {
  spawn,
  check_env
}
