import axios from 'axios';

export default function post(url,data){
      return axios({
              method: "post",
              url: url,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              data: data,
              transformRequest: [function (data) {
                  let ret = ''
                  for (let it in data) {
                      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                  }
                  return ret
              }],
          })
}
