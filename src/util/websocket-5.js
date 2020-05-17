
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var socket = /*#__PURE__*/function () {
  /* websocket实例 */

  /*'#'为私有属性，外部不可调用 */

  /* 状态 */
  //连接状态
  //把类的参数传入这里，方便调用

  /* 计时器 */
  //重连计时器
  //心跳计时器
  // 信息onmessage缓存方法

  /* 参数 */
  //心跳时间 50秒一次
  //心跳信息：默认为‘hello’随便改，看后台
  //是否自动重连
  //重连间隔时间
  //重连次数
  function socket(params) {
    _classCallCheck(this, socket);

    _defineProperty(this, "ws", null);

    _alive.set(this, {
      writable: true,
      value: false
    });

    _params.set(this, {
      writable: true,
      value: null
    });

    _reconnect_timer.set(this, {
      writable: true,
      value: null
    });

    _heart_timer.set(this, {
      writable: true,
      value: null
    });

    _message_func.set(this, {
      writable: true,
      value: null
    });

    _defineProperty(this, "heartBeat", 50000);

    _defineProperty(this, "heartMsg", 'hello');

    _defineProperty(this, "reconnect", true);

    _defineProperty(this, "reconnectTime", 5000);

    _defineProperty(this, "reconnectTimes", 10);

    _classPrivateFieldSet(this, _params, params);

    this.init();
  }
  /* 初始化 */


  _createClass(socket, [{
    key: "init",
    value: function init() {
      var _this = this;

      //重中之重，不然重连的时候会越来越快
      clearInterval(_classPrivateFieldGet(this, _reconnect_timer));
      clearInterval(_classPrivateFieldGet(this, _heart_timer)); //取出所有参数

      var params = _classPrivateFieldGet(this, _params); //设置连接路径


      var url = params.url,
          port = params.port;
      var global_params = ['heartBeat', 'heartMsg', 'reconnect', 'reconnectTime', 'reconnectTimes']; //定义全局变量

      Object.keys(params).forEach(function (key) {
        if (global_params.indexOf(key) !== -1) {
          _this[key] = params[key];
        }
      });
      var ws_url = port ? url + ':' + port : url; // this.ws = null

      delete this.ws;
      this.ws = new WebSocket(ws_url);
      console.log(this.ws); // window.console.log(this.#message_func)

      if (_classPrivateFieldGet(this, _message_func)) {
        this.onmessage(_classPrivateFieldGet(this, _message_func));
      } //默认绑定事件


      this.ws.onopen = function () {
        //设置状态为开启
        _classPrivateFieldSet(_this, _alive, true);

        clearInterval(_classPrivateFieldGet(_this, _reconnect_timer)); //连接后进入心跳状态

        _this.onheartbeat();
      };

      this.ws.onclose = function () {
        //设置状态为断开
        _classPrivateFieldSet(_this, _alive, false);

        clearInterval(_classPrivateFieldGet(_this, _heart_timer)); //自动重连开启  +  不在重连状态下

        if (true == _this.reconnect) {
          /* 断开后立刻重连 */
          _this.onreconnect();
        }
      };
    }
    /*
     *
     * 新增‘心跳事件’和‘重连事件’
     *
     */

    /* 心跳事件 */

  }, {
    key: "onheartbeat",
    value: function onheartbeat(func) {
      var _this2 = this;

      //在连接状态下
      if (true == _classPrivateFieldGet(this, _alive)) {
        /* 心跳计时器 */
        _classPrivateFieldSet(this, _heart_timer, setInterval(function () {
          //发送心跳信息
          _this2.send(_this2.heartMsg);

          func ? func(_this2) : false;
        }, this.heartBeat));
      }
    }
    /* 重连事件 */

  }, {
    key: "onreconnect",
    value: function onreconnect(func) {
      var _this3 = this;

      /* 重连间隔计时器 */
      _classPrivateFieldSet(this, _reconnect_timer, setInterval(function () {
        //限制重连次数
        if (_this3.reconnectTimes <= 0) {
          //关闭定时器
          // this.#isReconnect = false
          clearInterval(_classPrivateFieldGet(_this3, _reconnect_timer)); //跳出函数之间的循环

          return;
        } else {
          //重连一次-1
          _this3.reconnectTimes--;
        } //进入初始状态


        _this3.init();

        func ? func(_this3) : false;
      }, this.reconnectTime));
    }
    /*
     *
     * 对原生方法和事件进行封装
     *
     */
    // 发送消息 

  }, {
    key: "send",
    value: function send(text) {
      if (true == _classPrivateFieldGet(this, _alive)) {
        text = typeof text == 'string' ? text : JSON.stringify(text);
        this.ws.send(text);
      }
    } // 断开连接

  }, {
    key: "close",
    value: function close() {
      if (true == _classPrivateFieldGet(this, _alive)) {
        this.ws.close();
      }
    } //接受消息

  }, {
    key: "onmessage",
    value: function onmessage(func) {
      var _this4 = this;

      var all = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      this.ws.onmessage = function (data) {
        _classPrivateFieldSet(_this4, _message_func, func);

        func(!all ? data.data : data);
      };
    } //websocket连接成功事件

  }, {
    key: "onopen",
    value: function onopen(func) {
      var _this5 = this;

      this.ws.onopen = function (event) {
        _classPrivateFieldSet(_this5, _alive, true);

        func ? func(event) : false;
      };
    } //websocket关闭事件

  }, {
    key: "onclose",
    value: function onclose(func) {
      var _this6 = this;

      this.ws.onclose = function (event) {
        //设置状态为断开
        _classPrivateFieldSet(_this6, _alive, false);

        clearInterval(_classPrivateFieldGet(_this6, _heart_timer)); //自动重连开启  +  不在重连状态下

        if (true == _this6.reconnect) {
          /* 断开后立刻重连 */
          _this6.onreconnect();
        }

        func ? func(event) : false;
      };
    } //websocket错误事件

  }, {
    key: "onerror",
    value: function onerror(func) {
      this.ws.onerror = function (event) {
        func ? func(event) : false;
      };
    }
  }]);

  return socket;
}();

var _alive = new WeakMap();

var _params = new WeakMap();

var _reconnect_timer = new WeakMap();

var _heart_timer = new WeakMap();

var _message_func = new WeakMap();

var _default = socket;
exports.default = _default;