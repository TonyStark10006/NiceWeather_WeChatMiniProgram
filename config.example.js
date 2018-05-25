var CryptoJS = require('/utils/hmac-sha1.js');

function generateKey() {
  var ttl = 20
  var UID = "";
  var ts = Math.floor((new Date()).getTime() / 1000);
  var str = "ts=" + ts + "&ttl=" + ttl + "&uid=" + UID; // 参数字符串
  var KEY = "";
  var result = CryptoJS.HmacSHA1(str, KEY);
  var sig = result.toString(CryptoJS.enc.Base64);
  return {"sig": sig, "ts": ts, "UID": UID, "ttl": ttl};
}

var data = {
  "baiduUrl": '',
  "baiduAK": '',
  "xinzhiRTWthUrl": "",
  "xinzhiDailyWthUrl": "",
  "xinzhiSuggestionUrl": "",
  "cnRegionsURL": '',
  "getWeatherMsgURL": ''
}


module.exports = {data: data, generateKey: generateKey};