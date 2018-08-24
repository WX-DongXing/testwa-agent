import check from './check'
import { setEnv, isPass } from './db';

export default async function persistent() {
  let db = await check()
  for (let [k, v] of Object.entries(db.env)) {
    setEnv(k, v.version, v.path)
  }
  return isPass()
}