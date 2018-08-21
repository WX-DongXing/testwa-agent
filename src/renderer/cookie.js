export class Cookie {
  set(name, value, exDays) {
    const now = new Date();
    now.setTime(now.getTime() + (exDays * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${now.toGMTString()}`;
  }

  get(name) {
    let target = name + '=';
    const cookies = document.cookie.split(';');
    for(let cookie of cookies) {
      if (cookie.trim().indexOf(target) === 0) return cookie.trim().substring(target.length, cookie.trim().length)
    }
    return '';
  }

  getAll() {
    const cookies = {};
    if (document.cookie) {
      document.cookie.split(';').map(value => {
        let item = value.trim().split('=');
        let str1 = `{"${item[0]}":`;
        let str2 = isNaN(Number(item[1])) ? `"${item[1]}"` : item[1]
        let str3 = '}';
        Object.assign(cookies, JSON.parse(str1 + str2 + str3))
      })
    }
    return cookies;
  }

  remove(name) {
    let target = name + '=';
    const cookies = document.cookie.split(';');
    for(let cookie of cookies) {
      if (cookie.trim().indexOf(target) === 0) {
        document.cookie = `${target}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        break;
      }
    }
  }

  removeAll() {
    document.cookie.split(';').forEach(item => {
      document.cookie = `${item.trim().split('=')[0]}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    })
  }
}