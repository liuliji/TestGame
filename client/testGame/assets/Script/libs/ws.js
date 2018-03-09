// var Socket = require("phoenix").Socket;
//
// var HKHttp = require("hkhttp")
//
// var wsURL = "ws://" + window.location.host
// var URL = window.location.protocol + "//" + window.location.host;
//
// if (window.location.host == "17zyx.cn") {
//   wsURL = "ws://" + window.location.host
//   URL = window.location.protocol + "//" + window.location.host;
// } else if (window.location.host == "192.168.2.54:50000") {
//   wsURL = "ws://192.168.2.54:5000"
//   URL = window.location.protocol + "//" + window.location.host;
// } else {
//   wsURL = "ws://192.168.1.124:5000"
//   URL = window.location.protocol + "//" + window.location.host;
// }
//
// var socket;
// exports.socket = function() {
//   return socket;
// }
//
// var account = require("./account")
//
// exports.register = register = function() {
//   HKHttp.post(URL + "/api/register", ({
//       name: account.username(),
//       password: account.password()
//     }))
//     .onOK(function(msg) {
//       console.log(msg)
//       login(account.username(), account.password())
//     })
//     .onError(function(msg) {
//       console.log(msg)
//       account.clear()
//       register(account.username(), account.password())
//     })
//     .onTimeOut(function() {
//
//     })
// }
//
// exports.login = login = function() {
//
//   HKHttp.post(URL + "/api/login", ({
//       name: account.username(),
//       password: account.password()
//     }))
//     .onOK(function(msg) {
//       console.log(msg)
//       nickname = msg.user.nickname;
//
//       if (nickname && nickname.length) {
//         require("./user").setNickName(nickname)
//         require("./user").setUserID(msg.user.id)
//         require("./user").setHeadURL(msg.user.head)
//         enter(account.username(), account.password())
//       } else {
//         window.main.$emit("login");
//       }
//     })
//     .onError(function(msg) {
//       console.log(msg)
//
//       register(account.username(), account.password())
//     })
//     .onTimeOut(function() {
//
//     })
// }
//
// exports.setNickName = function(nickname) {
//   HKHttp.post(URL + "/api/user/edit", ({
//       nickname: nickname,
//       name: account.username(),
//       password: account.password()
//     }))
//     .onOK(function(msg) {
//       console.log(msg)
//       location.reload();
//       enter(account.username(), account.password())
//     })
//     .onError(function(msg) {
//       console.log(msg)
//     })
//     .onTimeOut(function() {
//
//     })
// }
//
// exports.enter = enter = function(name, password) {
//   myname = name
//
//   socket = new Socket(wsURL + "/socket/websocket?name=" + name + "&password=" + password, {
//     reconnectAfterMs: function(tries) {
//       return 1000;
//     }
//   })
//   socket.connect()
//
//   console.log("连接成功");
//
//   window.main.$emit("server:login", name);
// }