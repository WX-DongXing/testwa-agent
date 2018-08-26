export const UPDATE_ENV = 'env:updateEnv'

export function updateEnv(newEnv) {
  return {
    type: UPDATE_ENV,
    payload: {
      env: newEnv
    }
  }
}