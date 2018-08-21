export const UPDATE_USERNAME = 'login:updateUsername'
export const UPDATE_PASSWORD = 'login:updatePassword'

export function updateUsername(newUsername) {
  return {
    type: UPDATE_USERNAME,
    payload: {
      username: newUsername
    }
  }
}

export function updatePassword(newPassword) {
  return {
    type: UPDATE_PASSWORD,
    payload: {
      password: newPassword
    }
  }
}