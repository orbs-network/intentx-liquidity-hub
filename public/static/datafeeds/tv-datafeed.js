function obtenerFechaConFormato() {
  const ahora = new Date()

  const anio = ahora.getFullYear()
  const mes = String(ahora.getMonth() + 1).padStart(2, '0') // Meses comienzan desde 0
  const dia = String(ahora.getDate()).padStart(2, '0')
  const hora = String(ahora.getHours()).padStart(2, '0')
  const minutos = String(ahora.getMinutes()).padStart(2, '0')

  return `${anio}_${mes}_${dia}-${hora}_${minutos}`
}

!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define([], t)
    : 'object' == typeof exports
    ? (exports.TradingViewDatafeed = t())
    : (e.TradingViewDatafeed = t())
})(globalThis, () =>
  (() => {
    'use strict'
    var e = {
        137: (e, t) => {
          function s(e, t) {
            if (void 0 === e) throw new Error(''.concat(null != t ? t : 'Value', ' is undefined'))
            return e
          }
          function n(e, t) {
            if (null === e) throw new Error(''.concat(null != t ? t : 'Value', ' is null'))
            return e
          }
          ;(t.hu = void 0),
            (t.hu = function (e, t) {
              if (!e) throw new Error('Assertion failed'.concat(t ? ': '.concat(t) : ''))
            })
        },
      },
      t = {}
    function s(n) {
      var o = t[n]
      if (void 0 !== o) return o.exports
      var i = (t[n] = {
        exports: {},
      })
      return e[n](i, i.exports, s), i.exports
    }
    ;(s.d = (e, t) => {
      for (var n in t)
        s.o(t, n) &&
          !s.o(e, n) &&
          Object.defineProperty(e, n, {
            enumerable: !0,
            get: t[n],
          })
    }),
      (s.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
      (s.r = (e) => {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, {
            value: 'Module',
          }),
          Object.defineProperty(e, '__esModule', {
            value: !0,
          })
      }),
      (() => {
        const { miniCssF: e } = s
        s.miniCssF = (t) => (self.document && 'rtl' === self.document.dir ? e(t).replace(/\.css$/, '.rtl.css') : e(t))
      })()
    var n = {}
    return (
      (() => {
        function e(e, t = !1) {
          const { searchParams: s } = new URL(String(location))
          let n = 'true' === s.get('mobileapp_new'),
            o = 'true' === s.get('mobileapp')
          if (!t) {
            const e =
              (function (e) {
                const t = e + '=',
                  s = document.cookie.split(';')
                for (let e = 0; e < s.length; e++) {
                  let n = s[e]
                  for (; ' ' === n.charAt(0); ) n = n.substring(1, n.length)
                  if (0 === n.indexOf(t)) return n.substring(t.length, n.length)
                }
                return null
              })('tv_app') || ''
            n || (n = ['android', 'android_nps'].includes(e)), o || (o = 'ios' === e)
          }
          return !(('new' !== e && 'any' !== e) || !n) || !('new' === e || !o)
        }
        s.r(n),
          s.d(n, {
            TradingViewDatafeed: () => ae,
          })
        const t = () => {},
          o = '~m~'
        class i {
          constructor(e, t = {}) {
            ;(this.sessionid = null),
              (this.connected = !1),
              (this._timeout = null),
              (this._base = e),
              (this._options = {
                timeout: t.timeout || 2e4,
                connectionType: t.connectionType,
              })
          }
          connect() {
            ;(this._socket = new WebSocket(this._prepareUrl())),
              (this._socket.onmessage = (e) => {
                if ('string' != typeof e.data)
                  throw new TypeError(
                    `The WebSocket message should be a string. Recieved ${Object.prototype.toString.call(e.data)}`
                  )
                this._onData(e.data)
              }),
              (this._socket.onclose = this._onClose.bind(this)),
              (this._socket.onerror = this._onError.bind(this))
          }
          send(e) {
            this._socket && this._socket.send(this._encode(e))
          }
          disconnect() {
            this._clearIdleTimeout(),
              this._socket &&
                ((this._socket.onmessage = t),
                (this._socket.onclose = t),
                (this._socket.onerror = t),
                this._socket.close())
          }
          _clearIdleTimeout() {
            null !== this._timeout && (clearTimeout(this._timeout), (this._timeout = null))
          }
          _encode(e) {
            let t,
              s = ''
            const n = Array.isArray(e) ? e : [e],
              r = n.length
            for (let e = 0; e < r; e++)
              (t = null === n[e] || void 0 === n[e] ? '' : i._stringify(n[e])), (s += o + t.length + o + t)
            return s
          }
          _decode(e) {
            const t = []
            let s, n
            do {
              if (e.substring(0, 3) !== o) return t
              ;(s = ''), (n = '')
              const i = (e = e.substring(3)).length
              for (let t = 0; t < i; t++) {
                if (((n = Number(e.substring(t, t + 1))), Number(e.substring(t, t + 1)) !== n)) {
                  ;(e = e.substring(s.length + o.length)), (s = Number(s))
                  break
                }
                s += n
              }
              t.push(e.substring(0, s)), (e = e.substring(s))
            } while ('' !== e)
            return t
          }
          _onData(e) {
            this._setTimeout()
            const t = this._decode(e),
              s = t.length
            for (let e = 0; e < s; e++) this._onMessage(t[e])
          }
          _setTimeout() {
            this._clearIdleTimeout(), (this._timeout = setTimeout(this._onTimeout.bind(this), this._options.timeout))
          }
          _onTimeout() {
            this.disconnect(),
              this._onDisconnect({
                code: 4e3,
                reason: 'socket.io timeout',
                wasClean: !1,
              })
          }
          _onMessage(e) {
            this.sessionid
              ? this._checkIfHeartbeat(e)
                ? this._onHeartbeat(e.slice(3))
                : this._checkIfJson(e)
                ? this._base.onMessage(JSON.parse(e.slice(3)))
                : this._base.onMessage(e)
              : ((this.sessionid = e), this._onConnect())
          }
          _checkIfHeartbeat(e) {
            return this._checkMessageType(e, 'h')
          }
          _checkIfJson(e) {
            return this._checkMessageType(e, 'j')
          }
          _checkMessageType(e, t) {
            return e.substring(0, 3) === '~' + t + '~'
          }
          _onHeartbeat(e) {
            this.send('~h~' + e)
          }
          _onConnect() {
            ;(this.connected = !0), this._base.onConnect()
          }
          _onDisconnect(e) {
            this._clear(), this._base.onDisconnect(e), (this.sessionid = null)
          }
          _clear() {
            this.connected = !1
          }
          _prepareUrl() {
            const t = c(this._base.host)
            if (
              ((t.pathname += 'socket.io/websocket'),
              (t.protocol = 'wss:'),
              t.searchParams.append('from', ''),
              // DATE IN FORMAT 2023_12_04-12_54

              t.searchParams.append('date', obtenerFechaConFormato()),
              e('any') && t.searchParams.append('client', 'mobile'),
              this._options.connectionType && t.searchParams.append('type', this._options.connectionType),
              window.WEBSOCKET_PARAMS_ANALYTICS)
            ) {
              const { ws_page_uri: e, ws_ancestor_origin: s } = window.WEBSOCKET_PARAMS_ANALYTICS
              e && t.searchParams.append('page-uri', e), s && t.searchParams.append('ancestor-origin', s)
              // e && t.searchParams.append('page-uri', "localhost:3000"), s && t.searchParams.append('ancestor-origin', s)
              // e && t.searchParams.append('page-uri', "app.intentx.io%2F"), s && t.searchParams.append('ancestor-origin', "app.intentx.io")
            }
            return t.href
          }
          _onClose(e) {
            this._clearIdleTimeout(), this._onDisconnect(e)
          }
          _onError(e) {
            this._clearIdleTimeout(), this._clear(), this._base.emit('error', [e]), (this.sessionid = null)
          }
          static _stringify(e) {
            return '[object Object]' === Object.prototype.toString.call(e) ? '~j~' + JSON.stringify(e) : String(e)
          }
        }
        class r {
          constructor(e, t) {
            ;(this.host = e), (this._connecting = !1), (this._events = {}), (this.transport = this._getTransport(t))
          }
          isConnected() {
            return !!this.transport && this.transport.connected
          }
          isConnecting() {
            return this._connecting
          }
          connect() {
            this.isConnected() ||
              (this._connecting && this.disconnect(), (this._connecting = !0), this.transport.connect())
          }
          send(e) {
            this.transport && this.transport.connected && this.transport.send(e)
          }
          disconnect() {
            this.transport && this.transport.disconnect()
          }
          on(e, t) {
            e in this._events || (this._events[e] = []), this._events[e].push(t)
          }
          offAll() {
            this._events = {}
          }
          onMessage(e) {
            this.emit('message', [e])
          }
          emit(e, t = []) {
            if (e in this._events) {
              const s = this._events[e].concat(),
                n = s.length
              for (let e = 0; e < n; e++) s[e].apply(this, t)
            }
          }
          onConnect() {
            this.clear(), this.emit('connect')
          }
          onDisconnect(e) {
            this.emit('disconnect', [e])
          }
          clear() {
            this._connecting = !1
          }
          _getTransport(e) {
            return new i(this, e)
          }
        }
        function c(e) {
          const t = -1 !== e.indexOf('/') ? new URL(e) : new URL('wss://' + e)
          if ('wss:' !== t.protocol && 'https:' !== t.protocol) throw new Error('Invalid websocket base ' + e)
          return (
            t.pathname.endsWith('/') || (t.pathname += '/'), (t.search = ''), (t.username = ''), (t.password = ''), t
          )
        }
        const a = Number(window.TELEMETRY_WS_ERROR_LOGS_THRESHOLD) || 0
        class l {
          constructor(e, t = {}) {
            ;(this._queueStack = []),
              (this._logsQueue = []),
              (this._telemetryObjectsQueue = []),
              (this._reconnectCount = 0),
              (this._redirectCount = 0),
              (this._errorsCount = 0),
              (this._errorsInfoSent = !1),
              (this._connectionStart = null),
              (this._connectionEstablished = null),
              (this._reconnectTimeout = null),
              (this._onlineCancellationToken = null),
              (this._isConnectionForbidden = !1),
              (this._initialHost = t.initialHost || null),
              (this._suggestedHost = e),
              (this._proHost = t.proHost),
              (this._reconnectHost = t.reconnectHost),
              (this._noReconnectAfterTimeout = !0 === t.noReconnectAfterTimeout),
              (this._dataRequestTimeout = t.dataRequestTimeout),
              (this._connectionType = t.connectionType),
              this._doConnect(),
              t.pingRequired && -1 === window.location.search.indexOf('noping') && this._startPing()
          }
          connect() {
            this._tryConnect()
          }
          resetCounters() {
            ;(this._reconnectCount = 0), (this._redirectCount = 0)
          }
          setLogger(e, t) {
            ;(this._logger = e), (this._getLogHistory = t), this._flushLogs()
          }
          setTelemetry(e) {
            ;(this._telemetry = e),
              this._telemetry.reportSent.subscribe(this, this._onTelemetrySent),
              this._flushTelemetry()
          }
          onReconnect(e) {
            this._onReconnect = e
          }
          isConnected() {
            return !!this._socket && this._socket.isConnected()
          }
          isConnecting() {
            return !!this._socket && this._socket.isConnecting()
          }
          on(e, t) {
            return (
              !!this._socket &&
              ('connect' === e && this._socket.isConnected()
                ? t()
                : 'disconnect' === e
                ? this._disconnectCallbacks.push(t)
                : this._socket.on(e, t),
              !0)
            )
          }
          getSessionId() {
            return this._socket && this._socket.transport ? this._socket.transport.sessionid : null
          }
          send(e) {
            return this.isConnected() ? (this._socket.send(e), !0) : (this._queueMessage(e), !1)
          }
          getConnectionEstablished() {
            return this._connectionEstablished
          }
          getHost() {
            const e = this._tryGetProHost()
            return null !== e
              ? e
              : this._reconnectHost && this._reconnectCount > 3
              ? this._reconnectHost
              : this._suggestedHost
          }
          getReconnectCount() {
            return this._reconnectCount
          }
          getRedirectCount() {
            return this._redirectCount
          }
          getConnectionStart() {
            return this._connectionStart
          }
          disconnect() {
            this._clearReconnectTimeout(),
              (this.isConnected() || this.isConnecting()) &&
                (this._propagateDisconnect(), (this._disconnectCallbacks = []), this._closeSocket())
          }
          forbidConnection() {
            ;(this._isConnectionForbidden = !0), this.disconnect()
          }
          allowConnection() {
            ;(this._isConnectionForbidden = !1), this.connect()
          }
          isMaxRedirects() {
            return this._redirectCount >= 20
          }
          isMaxReconnects() {
            return this._reconnectCount >= 20
          }
          getPingInfo() {
            return this._pingInfo || null
          }
          _tryGetProHost() {
            return window.TradingView &&
              window.TradingView.onChartPage &&
              'battle' === window.environment &&
              !this._redirectCount &&
              -1 === window.location.href.indexOf('ws_host')
              ? this._initialHost
                ? this._initialHost
                : void 0 !== window.user && window.user.pro_plan
                ? this._proHost || this._suggestedHost
                : null
              : null
          }
          _queueMessage(e) {
            0 === this._queueStack.length && this._logMessage(0, 'Socket is not connected. Queued a message'),
              this._queueStack.push(e)
          }
          _processMessageQueue() {
            0 !== this._queueStack.length &&
              (this._logMessage(0, 'Processing queued messages'),
              this._queueStack.forEach(this.send.bind(this)),
              this._logMessage(0, 'Processed ' + this._queueStack.length + ' messages'),
              (this._queueStack = []))
          }
          _onDisconnect(e) {
            this._noReconnectAfterTimeout ||
              null !== this._reconnectTimeout ||
              (this._reconnectTimeout = setTimeout(this._tryReconnect.bind(this), 5e3)),
              this._clearOnlineCancellationToken()
            let t = 'disconnect session:' + this.getSessionId()
            e &&
              ((t += ', code:' + e.code + ', reason:' + e.reason),
              1005 === e.code && this._sendTelemetry('websocket_code_1005')),
              this._logMessage(0, t),
              this._propagateDisconnect(e),
              this._closeSocket(),
              (this._queueStack = [])
          }
          _closeSocket() {
            null !== this._socket && (this._socket.offAll(), this._socket.disconnect(), (this._socket = null))
          }
          _logMessage(e, t) {
            const s = {
              method: e,
              message: t,
            }
            this._logger
              ? this._flushLogMessage(s)
              : ((s.message = `[${new Date().toISOString()}] ${s.message}`), this._logsQueue.push(s))
          }
          _flushLogMessage(e) {
            switch (e.method) {
              case 2:
                this._logger.logDebug(e.message)
                break
              case 3:
                this._logger.logError(e.message)
                break
              case 0:
                this._logger.logInfo(e.message)
                break
              case 1:
                this._logger.logNormal(e.message)
            }
          }
          _flushLogs() {
            this._flushLogMessage({
              method: 1,
              message: 'messages from queue. Start.',
            }),
              this._logsQueue.forEach((e) => {
                this._flushLogMessage(e)
              }),
              this._flushLogMessage({
                method: 1,
                message: 'messages from queue. End.',
              }),
              (this._logsQueue = [])
          }
          _sendTelemetry(e, t) {
            const s = {
              event: e,
              params: t,
            }
            this._telemetry ? this._flushTelemetryObject(s) : this._telemetryObjectsQueue.push(s)
          }
          _flushTelemetryObject(e) {
            this._telemetry.sendChartReport(e.event, e.params, !1)
          }
          _flushTelemetry() {
            this._telemetryObjectsQueue.forEach((e) => {
              this._flushTelemetryObject(e)
            }),
              (this._telemetryObjectsQueue = [])
          }
          _doConnect() {
            ;(this._socket && (this._socket.isConnected() || this._socket.isConnecting())) ||
              (this._clearOnlineCancellationToken(),
              (this._host = this.getHost()),
              (this._socket = new r(this._host, {
                timeout: this._dataRequestTimeout,
                connectionType: this._connectionType,
              })),
              this._logMessage(0, 'Connecting to ' + this._host),
              this._bindEvents(),
              (this._disconnectCallbacks = []),
              (this._connectionStart = performance.now()),
              (this._connectionEstablished = null),
              this._socket.connect(),
              performance.mark('SWSC', {
                detail: 'Start WebSocket connection',
              }),
              this._socket.on('connect', () => {
                performance.mark('EWSC', {
                  detail: 'End WebSocket connection',
                }),
                  performance.measure('WebSocket connection delay', 'SWSC', 'EWSC')
              }))
          }
          _propagateDisconnect(e) {
            const t = this._disconnectCallbacks.length
            for (let s = 0; s < t; s++) this._disconnectCallbacks[s](e || {})
          }
          _bindEvents() {
            this._socket &&
              (this._socket.on('connect', () => {
                const e = this.getSessionId()
                if ('string' == typeof e) {
                  const t = JSON.parse(e)
                  if (t.redirect)
                    return (
                      (this._redirectCount += 1),
                      (this._suggestedHost = t.redirect),
                      this.isMaxRedirects() && this._sendTelemetry('redirect_bailout'),
                      void this._redirect()
                    )
                }
                ;(this._connectionEstablished = performance.now()),
                  this._processMessageQueue(),
                  this._logMessage(0, 'connect session:' + e)
              }),
              this._socket.on('disconnect', this._onDisconnect.bind(this)),
              this._socket.on('close', this._onDisconnect.bind(this)),
              this._socket.on('error', (e) => {
                this._logMessage(
                  0,
                  new Date() + ' session:' + this.getSessionId() + ' websocket error:' + JSON.stringify(e)
                ),
                  this._sendTelemetry('websocket_error'),
                  this._errorsCount++,
                  !this._errorsInfoSent &&
                    this._errorsCount >= a &&
                    (void 0 !== this._lastConnectCallStack &&
                      (this._sendTelemetry('websocket_error_connect_stack', {
                        text: this._lastConnectCallStack,
                      }),
                      delete this._lastConnectCallStack),
                    void 0 !== this._getLogHistory &&
                      this._sendTelemetry('websocket_error_log', {
                        text: this._getLogHistory(50).join('\n'),
                      }),
                    (this._errorsInfoSent = !0))
              }))
          }
          _redirect() {
            this.disconnect(), this._reconnectWhenOnline()
          }
          _tryReconnect() {
            this._tryConnect() && (this._reconnectCount += 1)
          }
          _tryConnect() {
            return (
              !this._isConnectionForbidden &&
              (this._clearReconnectTimeout(),
              (this._lastConnectCallStack =
                new Error(`WebSocket connect stack. Is connected: ${this.isConnected()}.`).stack || ''),
              !this.isConnected() && (this.disconnect(), this._reconnectWhenOnline(), !0))
            )
          }
          _clearOnlineCancellationToken() {
            this._onlineCancellationToken && (this._onlineCancellationToken(), (this._onlineCancellationToken = null))
          }
          _clearReconnectTimeout() {
            null !== this._reconnectTimeout && (clearTimeout(this._reconnectTimeout), (this._reconnectTimeout = null))
          }
          _reconnectWhenOnline() {
            if (navigator.onLine)
              return (
                this._logMessage(0, 'Network status: online - trying to connect'),
                this._doConnect(),
                void (this._onReconnect && this._onReconnect())
              )
            this._logMessage(0, 'Network status: offline - wait until online'),
              (this._onlineCancellationToken = (function (e) {
                let t = e
                const s = () => {
                  window.removeEventListener('online', s), t && t()
                }
                return (
                  window.addEventListener('online', s),
                  () => {
                    t = null
                  }
                )
              })(() => {
                this._logMessage(0, 'Network status changed to online - trying to connect'),
                  this._doConnect(),
                  this._onReconnect && this._onReconnect()
              }))
          }
          _onTelemetrySent(e) {
            'websocket_error' in e && ((this._errorsCount = 0), (this._errorsInfoSent = !1))
          }
          _startPing() {
            if (this._pingIntervalId) return
            const e = c(this.getHost())
            ;(e.pathname += 'ping'), (e.protocol = 'https:')
            let t = 0,
              s = 0
            const n = (e) => {
              this._pingInfo = this._pingInfo || {
                max: 0,
                min: 1 / 0,
                avg: 0,
              }
              const n = new Date().getTime() - e
              n > this._pingInfo.max && (this._pingInfo.max = n),
                n < this._pingInfo.min && (this._pingInfo.min = n),
                (t += n),
                s++,
                (this._pingInfo.avg = t / s),
                s >= 10 && this._pingIntervalId && (clearInterval(this._pingIntervalId), delete this._pingIntervalId)
            }
            this._pingIntervalId = setInterval(() => {
              const t = new Date().getTime(),
                s = new XMLHttpRequest()
              s.open('GET', e, !0),
                s.send(),
                (s.onreadystatechange = () => {
                  s.readyState === XMLHttpRequest.DONE && 200 === s.status && n(t)
                })
            }, 1e4)
          }
        }
        class h {
          constructor(e, t) {
            ;(this._subscribers = {}),
              (this._requestsPending = 0),
              (this._historyProvider = e),
              setInterval(this._updateData.bind(this), t)
          }
          subscribeBars(e, t, s, n) {
            this._subscribers.hasOwnProperty(n) ||
              (this._subscribers[n] = {
                lastBarTime: null,
                listener: s,
                resolution: t,
                symbolInfo: e,
              })
          }
          unsubscribeBars(e) {
            delete this._subscribers[e]
          }
          _updateData() {
            if (!(this._requestsPending > 0)) {
              this._requestsPending = 0
              for (const e in this._subscribers)
                (this._requestsPending += 1),
                  this._updateDataForSubscriber(e)
                    .then(() => {
                      this._requestsPending -= 1
                    })
                    .catch((e) => {
                      this._requestsPending -= 1
                    })
            }
          }
          _updateDataForSubscriber(e) {
            const t = this._subscribers[e],
              s = parseInt((Date.now() / 1e3).toString()),
              n =
                s -
                (function (e, t) {
                  let s = 0
                  s =
                    'D' === e || '1D' === e
                      ? t
                      : 'M' === e || '1M' === e
                      ? 31 * t
                      : 'W' === e || '1W' === e
                      ? 7 * t
                      : (t * parseInt(e)) / 1440
                  return 24 * s * 60 * 60
                })(t.resolution, 10)
            return this._historyProvider
              .getBars(t.symbolInfo, t.resolution, {
                from: n,
                to: s,
                countBack: 2,
                firstDataRequest: !1,
              })
              .then((t) => {
                this._onSubscriberDataReceived(e, t)
              })
          }
          _onSubscriberDataReceived(e, t) {
            if (!this._subscribers.hasOwnProperty(e)) return
            const s = t.bars
            if (0 === s.length) return
            const n = s[s.length - 1],
              o = this._subscribers[e]
            if (null !== o.lastBarTime && n.time < o.lastBarTime) return
            if (null !== o.lastBarTime && n.time > o.lastBarTime) {
              if (s.length < 2) throw new Error('Not enough bars in history for proper pulse update. Need at least 2.')
              const e = s[s.length - 2]
              o.listener(e)
            }
            ;(o.lastBarTime = n.time), o.listener(n)
          }
        }
        class d {
          constructor() {
            this._enabled = !1
          }
          setLoggingEnabled(e) {
            this._enabled = e
          }
          log(...e) {
            this._enabled && console.log(...e)
          }
          error(...e) {
            this._enabled && console.error(...e)
          }
          static getInstance() {
            return null === this._instance && (this._instance = new d()), this._instance
          }
        }
        function _(e) {
          return '=' + JSON.stringify(u(e))
        }
        function u(e) {
          return Object.keys(e)
            .sort()
            .reduce(
              (t, s) => (
                '[object Object]' === Object.prototype.toString.call(e[s]) ? (t[s] = u(e[s])) : (t[s] = e[s]), t
              ),
              {}
            )
        }
        function g(e) {
          return Boolean(e.inputs) ||
            (function (e) {
              return Boolean(e.replay)
            })(e) ||
            e.session ||
            e.adjustment ||
            e['currency-id'] ||
            e['unit-id']
            ? _(e)
            : e.symbol
        }
        d._instance = null
        const m = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        function p() {
          return (function (e) {
            let t = ''
            for (let s = 0; s < e; ++s) {
              const e = Math.floor(Math.random() * m.length)
              t += m[e]
            }
            return t
          })(12)
        }
        function b(e) {
          return (e.index = e.i), (e.value = e.v), delete e.i, delete e.v, e
        }
        function y(e) {
          for (const t of Object.keys(e))
            e[t].t && (e[t].turnaround = e[t].t),
              e[t].s && !e[t].series && (e[t].series = e[t].s.map(b)),
              e[t].st && !e[t].series && (e[t].series = e[t].st.map(b))
        }
        class f {
          chart_create_session(e) {
            return [e, 'library_datafeed']
          }
          resolve_symbol(e, t, s) {
            return [e, t, s]
          }
          create_series(e, t, s, n, o, i) {
            return [e, t, s, n, o, i, '']
          }
          remove_series(e, t) {
            return [e, t]
          }
          unpack(e) {
            const t = JSON.parse(e)
            t.m && t.p && ((t.method = t.m), (t.params = t.p), (t.time = t.t))
            const s = t.params[1]
            switch (t.method) {
              case 'du':
                ;(t.method = 'data_update'), y(s)
                break
              case 'timescale_update':
                y(s)
            }
            return t
          }
        }
        var w = s(137)
        const k = 'undefined' != typeof window ? window : {}
        let S = !1
        try {
          localStorage.getItem(''), (S = !0)
        } catch (e) {}
        var v
        !(function (e) {
          ;(e[(e.ERROR = 1)] = 'ERROR'),
            (e[(e.WARNING = 2)] = 'WARNING'),
            (e[(e.INFO = 3)] = 'INFO'),
            (e[(e.NORMAL = 4)] = 'NORMAL'),
            (e[(e.DEBUG = 5)] = 'DEBUG')
        })(v || (v = {}))
        let C = 0
        const I = 'tv.logger.loglevel',
          R = 'tv.logger.logHighRate',
          T = []
        let B = null,
          M = null,
          D = null,
          E = NaN,
          q = v.WARNING,
          O = !1
        function P(e) {
          ;(e = Math.max(v.ERROR, Math.min(v.DEBUG, e))), (q = e), H()
        }
        function L(e, t, s, n) {
          if (t === M && n.id === D) return
          const o = new Date()
          if (
            (e <= v.NORMAL &&
              (function (e, t, s, n, o) {
                'function' == typeof structuredClone && (t = structuredClone(t))
                const i = {
                  id: C,
                  message: t,
                  subSystemId: n,
                  timestamp: Number(e),
                }
                ;(C += 1), s.push(i), void 0 !== o && s.length > o && s.splice(0, 1)
              })(o, t, s, n.id, n.maxCount),
            e <= q && (!n.highRate || O) && (!B || n.id.match(B)))
          ) {
            const s = o.toISOString() + ':' + n.id + ':' + t
            switch (e) {
              case v.DEBUG:
                console.debug(s)
                break
              case v.INFO:
              case v.NORMAL:
                n.color ? console.log('%c' + s, 'color: ' + n.color) : console.log(s)
                break
              case v.WARNING:
                console.warn(s)
                break
              case v.ERROR:
                console.error(s)
            }
            ;(M = t),
              (D = n.id),
              E && clearTimeout(E),
              (E = setTimeout(() => {
                ;(M = null), (D = null), (E = NaN)
              }, 1e3))
          }
        }
        function N(e, t = {}) {
          const s = []
          T.push(s)
          const n = Object.assign(t, {
            id: e,
          })
          function o(e) {
            return (t) => L(e, String(t), s, n)
          }
          return {
            logDebug: o(v.DEBUG),
            logError: o(v.ERROR),
            logInfo: o(v.INFO),
            logNormal: o(v.NORMAL),
            logWarn: o(v.WARNING),
          }
        }
        const x = N('logger')
        ;(k.lon = (e, t) => {
          P(v.DEBUG), x.logNormal('Debug logging enabled'), (O = Boolean(e)), (B = t || null), H()
        }),
          (k.loff = () => {
            P(v.INFO), x.logInfo('Debug logging disabled')
          })
        function H() {
          try {
            S && (localStorage.setItem(R, String(O)), localStorage.setItem(I, String(q)))
          } catch (e) {
            x.logWarn(`Cannot save logger state (level: ${q}, high-rate: ${O}) to localStorage: ${e.message}`)
          }
        }
        !(function () {
          O = !!S && 'true' === localStorage.getItem(R)
          let e = parseInt((S && localStorage.getItem(I)) || '')
          Number.isNaN(e) && (e = v.WARNING), P(e), x.logNormal(`Init with settings - level: ${q}, high-rate: ${O}`)
        })(),
          k.performance && k.performance.now
            ? x.logNormal(`Sync logger and perf times, now is ${k.performance.now()}`)
            : x.logWarn('Perf time is not available')
        N('Common.InitData'), window.initData
        var U
        !(function (e) {
          ;(e[(e.Medium = 0)] = 'Medium'), (e[(e.Large = 1)] = 'Large')
        })(U || (U = {}))
        class A {
          constructor(e) {
            ;(0, w.hu)('' !== e, 'S3 base url must be a non-empty string'), (this._baseUrl = e)
          }
          getSymbolLogoUrl(e, t) {
            switch (((0, w.hu)('' !== e, 'logo id must be a non-empty string'), t)) {
              case U.Medium:
                return this._baseUrl + `${e}.svg`
              case U.Large:
                return this._baseUrl + `${e}--big.svg`
            }
          }
          getCountryFlagUrl(e, t) {
            return this.getSymbolLogoUrl('country/' + e, t)
          }
          getCryptoLogoUrl(e, t) {
            return this.getSymbolLogoUrl('crypto/' + e, t)
          }
          getProviderLogoUrl(e, t) {
            return this.getSymbolLogoUrl('provider/' + e, t)
          }
        }
        const Q = 'https://s3-symbol-logo.tradingview.com/',
          $ = new A(Q)
        function F(e) {
          return 2 !== e.length
            ? e
            : (function (e) {
                return e.some((e) => W(e))
              })(e) &&
              !(function (e) {
                return e.some((e) => e.includes('country') && !W(e))
              })(e)
            ? e.filter((e) => !W(e))
            : e
        }
        function W(e) {
          return e.includes('country/US')
        }
        function j(e) {
          const t = {},
            s = F(
              (function (e, t = U.Medium) {
                const s = e.logoid,
                  n = e['base-currency-logoid'],
                  o = e['currency-logoid'],
                  i = s && $.getSymbolLogoUrl(s, t)
                if (i) return [i]
                const r = n && $.getSymbolLogoUrl(n, t),
                  c = o && $.getSymbolLogoUrl(o, t)
                return r && c ? [r, c] : r ? [r] : c ? [c] : []
              })(e, U.Medium)
            )
          s.length >= 1 && (t.logo_urls = s)
          const n = e.country ? $.getCountryFlagUrl(e.country, U.Medium) : void 0,
            o = e.provider_id ? $.getProviderLogoUrl(e.provider_id, U.Medium) : void 0
          return (n || o) && (t.exchange_logo = n || o), t
        }
        const G = ['1', '5', '15', '30', '45', '60', '120', '180', '240', '1D', '5D', '1W', '1M'],
          V = {
            supports_marks: !1,
            supports_timescale_marks: !0,
            supported_resolutions: G,
            exchanges: [
              {
                value: '',
                name: '',
                desc: '',
              },
            ],
            symbols_types: [
              {
                name: 'All',
                value: '',
              },
              {
                name: 'Stock',
                value: 'stock',
              },
              {
                name: 'Forex',
                value: 'forex',
              },
              {
                name: 'Index',
                value: 'index',
              },
              {
                name: 'Crypto',
                value: 'crypto',
              },
            ],
            is_tradingview_data: !0,
          },
          J = d.getInstance(),
          X = {
            USDT: 'USD',
            USDC: 'USD',
            DAI: 'USD',
            BUSD: 'USD',
            TUSD: 'USD',
            USDP: 'USD',
            USDD: 'USD',
            GUSD: 'USD',
          }
        const Y = '_#_'
        function K(e) {
          return (
            e.full_name +
            (e.currency_code ? Y + e.currency_code : '') +
            (e.unit_id ? Y + e.unit_id : '') +
            (e.subsession_id ? Y + e.subsession_id : '')
          )
        }
        class z {
          constructor(e, t) {
            ;(this._sessionId = 'lib_sess_' + p()),
              (this._dataHandleModule = new f()),
              (this._seriesIdCounter = 0),
              (this._seriesBarAccumulatorBySeriesId = new Map()),
              (this._seriesFlagsBySeriesId = new Map()),
              (this._symbolIdCounter = 0),
              (this._isConnected = !1),
              (this._symbolIdBySymbolInfo = new Map()),
              (this._pendingSeriesId = []),
              (this._wsBackendConnection = e),
              (this._quotesProvider = t),
              (this._responseHandlers = {
                data_update: {
                  [this._sessionId]: {},
                },
                series_error: {
                  [this._sessionId]: {},
                },
                series_completed: {
                  [this._sessionId]: {},
                },
                timescale_update: {
                  [this._sessionId]: {},
                },
                series_deleted: {
                  [this._sessionId]: {},
                },
                symbol_resolved: {
                  [this._sessionId]: {},
                },
                symbol_error: {
                  [this._sessionId]: {},
                },
              }),
              this._bindSocketEvents()
          }
          async resolveSymbol(e, t) {
            const s = this._getNextSymbolId(),
              n = this._symbolStringForResolve(e, t),
              o = this._waitForResponse('symbol_error', this._sessionId, s)
            await this._sendRequest('resolve_symbol', [this._sessionId, s, n])
            const i = this._waitForResponse('symbol_resolved', this._sessionId, s),
              [, , r] = await Promise.race([o, i])
            if ('string' == typeof r) throw new Error(r)
            const c = this._adjustSymbolInfoForLibrary(r)
            return await this._tryInjectLogosFromQuoteData(e, c), this._symbolIdBySymbolInfo.set(K(c), s), c
          }
          async getBars(e, t, s) {
            var n
            J.log(`getBars ${e.name} ${t}`)
            const o = this._getNextSeriesId(),
              i = this._symbolIdBySymbolInfo.get(K(e))
            if (void 0 === i)
              return {
                bars: [],
                meta: {
                  noData: !0,
                },
              }
            if ((this._pendingSeriesId.push(o), this._pendingSeriesId.length > 1)) {
              const e = this._pendingSeriesId[this._pendingSeriesId.length - 2]
              J.log(`waiting for ${e} to be deleted`)
              const [, t] = await this._waitForResponse('series_deleted', this._sessionId, e)
              J.log(`deleted ${t}`)
            }
            const r = this._waitForResponse('series_error', this._sessionId, o)
            await this._sendRequest('create_series', [this._sessionId, o, 't', i, t, ['bar_count', s.to, s.countBack]]),
              this._startAccumulatingSeriesBars(this._sessionId, o)
            const [c, , , , a] = await Promise.race([r, this._waitForResponse('series_completed', this._sessionId, o)])
            await this._sendRequest('remove_series', [this._sessionId, o]),
              await this._waitForResponse('series_deleted', this._sessionId, o)
            const l = this._stopAccumulatingSeriesBars(this._sessionId, o)
            if (
              ((this._pendingSeriesId = this._pendingSeriesId.filter((e) => e !== o)),
              'boolean' == typeof c && 'string' == typeof a)
            )
              throw new Error(a)
            const h =
              void 0 !== (null === (n = this._seriesFlagsBySeriesId.get(o)) || void 0 === n ? void 0 : n.data_completed)
            return {
              bars: l,
              meta:
                0 === l.length && h
                  ? {
                      noData: !0,
                    }
                  : {},
            }
          }
          _getNextSymbolId() {
            return 'sym' + this._symbolIdCounter++
          }
          _getNextSeriesId() {
            return 's' + this._seriesIdCounter++
          }
          _symbolStringForResolve(e, t) {
            return void 0 === t
              ? e
              : ((function (e) {
                  e.currencyCode && (e.currencyCode = X[e.currencyCode] || e.currencyCode)
                })(t),
                g({
                  symbol: e,
                  'currency-id': t.currencyCode,
                  'unit-id': t.unitId,
                  session: t.session,
                }))
          }
          async _sendRequest(e, t) {
            const s = JSON.stringify({
              m: e,
              p: t,
            })
            J.log('send message', e, s), this._wsBackendConnection.send(s)
          }
          _startAccumulatingSeriesBars(e, t) {
            this._seriesBarAccumulatorBySeriesId.delete(t), this._seriesBarAccumulatorBySeriesId.set(t, [])
            const s = ([, e]) => {
              const s = e[t].s || [],
                n = this._seriesBarAccumulatorBySeriesId.get(t)
              if (void 0 !== n) for (let e = 0; e < s.length; e++) n.push(s[e].value)
            }
            ;(this._responseHandlers.data_update[e][t] = s),
              (this._responseHandlers.timescale_update[e][t] = s),
              this._seriesFlagsBySeriesId.set(t, void 0)
            this._responseHandlers.series_completed[e][t] = ([, , , , e]) => {
              this._seriesFlagsBySeriesId.set(t, e)
            }
          }
          _stopAccumulatingSeriesBars(e, t) {
            const s = this._seriesBarAccumulatorBySeriesId.get(t)
            let n = []
            return (
              void 0 !== s &&
                (n = s.map((e) => ({
                  time: 1e3 * e[0],
                  open: e[1],
                  high: e[2],
                  low: e[3],
                  close: e[4],
                  volume: e[5],
                }))),
              this._seriesBarAccumulatorBySeriesId.delete(t),
              delete this._responseHandlers.series_completed[e][t],
              delete this._responseHandlers.data_update[e][t],
              delete this._responseHandlers.timescale_update[e][t],
              n
            )
          }
          _adjustSymbolInfoForLibrary(e) {
            const t = {
              ...e,
              base_name: e.base_name ? [e.base_name] : void 0,
              timezone: e.timezone,
              format: e.format || 'price',
              supported_resolutions: e.supported_resolutions || G,
              data_status: void 0,
              subsessions: e.subsessions,
            }
            switch (e.delay) {
              case void 0:
              case 0:
                t.data_status = 'streaming'
                break
              case -1:
                t.data_status = 'endofday'
                break
              case -2:
                t.data_status = 'pulsed'
                break
              default:
                t.data_status = 'delayed_streaming'
            }
            return e.listed_exchange && (t.exchange = e.listed_exchange), t
          }
          async _waitForResponse(e, t, s) {
            return new Promise((n) => {
              const o = this._responseHandlers[e][t][s]
              this._responseHandlers[e][t][s] = (i) => {
                delete this._responseHandlers[e][t][s], null == o || o(i), n(i)
              }
            })
          }
          _bindSocketEvents() {
            this._wsBackendConnection.on('connect', () => {
              this._onConnect()
            }),
              this._wsBackendConnection.on('message', (e) => {
                this._onMessage(e)
              }),
              this._wsBackendConnection.on('disconnect', () => {
                J.error('disconnect')
              })
          }
          _onConnect() {
            this._isConnected
              ? J.error('_onConnected called again')
              : ((this._isConnected = !0), this._sendRequest('chart_create_session', [this._sessionId]))
          }
          _onMessage(e) {
            const t = this._unpack(e)
            if ((J.log('receive message', t), 'protocol_switched' !== t.method))
              return 'protocol_error' === t.method || 'critical_error' === t.method
                ? (J.error(t), void this._wsBackendConnection.disconnect())
                : void this._dispatchNotification(t, e)
          }
          _dispatchNotification(e, t) {
            switch (e.method) {
              case 'symbol_error': {
                const [t, s] = e.params,
                  n = this._responseHandlers.symbol_error[t][s]
                n && n(e.params)
                break
              }
              case 'symbol_resolved': {
                const [t, s] = e.params,
                  n = this._responseHandlers.symbol_resolved[t][s]
                n && n(e.params)
                break
              }
              case 'data_update': {
                const [t, s] = e.params
                for (const n of Object.keys(s)) {
                  const s = this._responseHandlers.data_update[t][n]
                  s && s(e.params)
                }
                break
              }
              case 'timescale_update': {
                const [t, s] = e.params
                for (const n of Object.keys(s)) {
                  const s = this._responseHandlers.timescale_update[t][n]
                  s && s(e.params)
                }
                break
              }
              case 'series_completed': {
                const [t, s] = e.params,
                  n = this._responseHandlers.series_completed[t][s]
                n && n(e.params)
                break
              }
              case 'series_error': {
                J.error('series_error', e)
                const t = e.params,
                  [s, n] = t,
                  o = this._responseHandlers.series_error[s][n]
                o && o([!0, ...t])
                break
              }
              case 'series_deleted': {
                const [t, s] = e.params,
                  n = this._responseHandlers.series_deleted[t][s]
                n && n(e.params)
                break
              }
            }
          }
          _unpack(e) {
            return this._dataHandleModule.unpack(e)
          }
          async _tryInjectLogosFromQuoteData(e, t) {
            try {
              const s = e,
                n = await this._quotesProvider.getQuoteData(s),
                o = this._extractQuoteValues(s, n)
              if (!o) throw new Error()
              const i = (function (e) {
                const t = {}
                return (
                  e['base-currency-logoid'] &&
                    !e['base-currency-logoid'].startsWith(Q) &&
                    (t['base-currency-logoid'] = $.getSymbolLogoUrl(e['base-currency-logoid'], U.Medium)),
                  e['currency-logoid'] &&
                    !e['currency-logoid'].startsWith(Q) &&
                    (t['currency-logoid'] = $.getSymbolLogoUrl(e['currency-logoid'], U.Medium)),
                  e.logoid && !e.logoid.startsWith(Q) && (t.logoid = $.getSymbolLogoUrl(e.logoid, U.Medium)),
                  e.provider_id &&
                    !e.provider_id.startsWith(Q) &&
                    (t.provider_id = $.getProviderLogoUrl(e.provider_id, U.Medium)),
                  e.country_code &&
                    !e.country_code.startsWith(Q) &&
                    (t.country = $.getCountryFlagUrl(e.country_code, U.Medium)),
                  t
                )
              })(o)
              i.logoid && (t.logo_urls = [i.logoid]),
                i['base-currency-logoid'] &&
                  i['currency-logoid'] &&
                  (t.logo_urls = [i['base-currency-logoid'], i['currency-logoid']]),
                (t.exchange_logo = i.country || i.provider_id)
            } catch (t) {
              J.error(`Unable to get quote data for ${e} while resolving symbol info`)
            }
          }
          _extractQuoteValues(e, t) {
            const s = t.filter((t) => 'ok' === t.s && t.n === e).map((e) => e.v)
            return s.length < 1 ? null : s[0]
          }
        }
        const Z = d.getInstance(),
          ee = [
            'ch',
            'chp',
            'short_name',
            'exchange',
            'original_name',
            'description',
            'lp',
            'ask',
            'bid',
            'open_price',
            'high_price',
            'low_price',
            'prev_close_price',
            'volume',
            'spread',
            'logoid',
            'base-currency-logoid',
            'currency-logoid',
            'country',
            'country_code',
            'provider_id',
            'sector',
            'listed_exchange',
            'industry',
          ],
          te = [
            'dividend_amount_recent',
            'dividend_ex_date_recent',
            'dividend_payout_ratio_ttm',
            'earnings_release_date_fq_h',
            'earnings_per_share_forecast_fq_h',
            'earnings_per_share_fq_h',
            'earnings_fiscal_period_fq_h',
          ]
        class se {
          constructor(e) {
            ;(this._isConnected = !1),
              (this._sessionId = 'qs_' + p()),
              (this._mostRecentQuoteDataBySymbol = new Map()),
              (this._dataHandleModule = new f()),
              (this._listenerGuidsBySymbol = new Map()),
              (this._callbackByListenerGuid = new Map()),
              (this._completedQuotes = new Set()),
              (this._quoteCompletionPromises = new Map()),
              (this._quoteCompletionPromiseRevolvers = new Map()),
              (this._currentSymbols = new Set()),
              (this._wsBackendConnection = e),
              this._bindSocketEvents()
          }
          async getQuotes(e, t, s) {
            try {
              const s = await this._getQuoteData(e)
              Z.log('getQuotes', e, s), t(s)
            } catch (e) {
              s(e instanceof Error ? e.message : 'Unknown error')
            }
          }
          subscribeQuotes(e, t, s, n) {
            const o = e.concat(t),
              i = []
            for (const e of o) {
              const t = this._listenerGuidsBySymbol.get(e)
              void 0 === t ? (i.push(e), this._listenerGuidsBySymbol.set(e, new Set([n]))) : t.add(n)
            }
            this._callbackByListenerGuid.set(n, s),
              this._addSymbols(i),
              this._sendRequest('quote_fast_symbols', [this._sessionId, ...t])
          }
          unsubscribeQuotes(e) {
            const t = []
            for (const [s, n] of this._listenerGuidsBySymbol) n.has(e) && (t.push(s), n.delete(e))
            this._callbackByListenerGuid.delete(e),
              t.forEach((e) => this._currentSymbols.delete(e)),
              this._sendRequest('quote_remove_symbols', [this._sessionId, ...t])
          }
          async getQuoteData(e) {
            return this._getQuoteData([e])
          }
          async _getQuoteData(e) {
            const t = [],
              s = e.filter((e) => !this._currentSymbols.has(e))
            this._addSymbols(s)
            const n = e.map((e) => this._quoteCompletionPromises.get(e)).filter(Boolean),
              o = new Promise((e) => setTimeout(e, 2e3))
            await Promise.race([o, Promise.all(n)])
            for (const s of e) {
              const e = this._mostRecentQuoteDataBySymbol.get(s)
              void 0 !== e &&
                t.push({
                  s: 'ok',
                  v: e,
                  n: s,
                })
            }
            return t
          }
          _addSymbols(e) {
            const t = e.filter((e) => !this._currentSymbols.has(e))
            t.forEach((e) => {
              this._quoteCompletionPromises.set(
                e,
                new Promise((t) => {
                  this._quoteCompletionPromiseRevolvers.set(e, t)
                })
              ),
                this._currentSymbols.add(e)
            }),
              this._sendRequest('quote_add_symbols', [this._sessionId, ...t])
          }
          _bindSocketEvents() {
            this._wsBackendConnection.on('connect', () => {
              this._onConnect()
            }),
              this._wsBackendConnection.on('message', (e) => {
                this._onMessage(e)
              }),
              this._wsBackendConnection.on('disconnect', () => {
                Z.error('disconnect')
              })
          }
          _onMessage(e) {
            var t, s
            const n = this._unpack(e)
            if ((Z.log('receive message', n), 'protocol_switched' !== n.method)) {
              if ('protocol_error' === n.method) return Z.error(n), void this._wsBackendConnection.disconnect()
              if ('critical_error' === n.method) return Z.error(n), void this._wsBackendConnection.disconnect()
              switch (n.method) {
                case 'qsd': {
                  const [, e] = n.params
                  if ('error' === e.s) {
                    Z.error(e.errmsg || 'qsd error')
                    break
                  }
                  const i = e.n,
                    r = null !== (t = this._listenerGuidsBySymbol.get(i)) && void 0 !== t ? t : [],
                    c = {
                      ...(this._mostRecentQuoteDataBySymbol.get(i) || {}),
                      ...e.v,
                    }
                  c.listed_exchange && (c.exchange = c.listed_exchange),
                    this._mostRecentQuoteDataBySymbol.set(i, c),
                    (e.v =
                      ((o = c),
                      {
                        ...o,
                        logoid: void 0,
                        provider_id: void 0,
                        'base-currency-logoid': void 0,
                        'currency-logoid': void 0,
                      }))
                  for (const t of r) null === (s = this._callbackByListenerGuid.get(t)) || void 0 === s || s([e])
                  break
                }
                case 'quote_completed': {
                  const [, e] = n.params
                  this._completedQuotes.add(e)
                  const t = this._quoteCompletionPromiseRevolvers.get(e)
                  t && t()
                  break
                }
              }
              var o
            }
          }
          _unpack(e) {
            return this._dataHandleModule.unpack(e)
          }
          _onConnect() {
            this._isConnected
              ? Z.error('_onConnected called again')
              : ((this._isConnected = !0),
                this._sendRequest('quote_create_session', [this._sessionId]),
                this._sendRequest('quote_set_fields', [this._sessionId, ...ee, ...te]))
          }
          _sendRequest(e, t) {
            const s = JSON.stringify({
              m: e,
              p: t,
            })
            Z.log('send message', e, s), this._wsBackendConnection.send(s)
          }
        }
        const ne = N('Fetch')
        function oe(e, t, s = {}) {
          {
            ;(t = t || {}),
              (function (e) {
                return new URL(e, document.baseURI).origin === location.origin
              })(e) &&
                (t.headers
                  ? t.headers instanceof Headers || (t.headers = new Headers(t.headers))
                  : (t.headers = new Headers()),
                window.locale && t.headers.set('X-Language', window.locale),
                t.headers.set('X-Requested-With', 'XMLHttpRequest')),
              void 0 === t.credentials && (t.credentials = 'same-origin')
            const n = window.fetch(e, t)
            return (
              n.then(
                (n) => {
                  if (!n.ok) {
                    let o = ''
                    t.method && (o += `${t.method.toUpperCase()} `),
                      (o += e),
                      (o += `. Status ${n.status}`),
                      n.statusText && (o += `. ${n.statusText}`),
                      n.headers.via && (o += `. Via: ${n.headers.via}`),
                      s.logBodyOnError && 'string' == typeof t.body && (o += `. Body: ${t.body.slice(0, 1024)}`),
                      ne.logError(o)
                  }
                  return n
                },
                (s) => {
                  if (s && 'AbortError' === s.name) return
                  let n = ''
                  t.method && (n += `${t.method.toUpperCase()} `),
                    (n += e),
                    navigator.onLine ? (n += `. ${s}`) : (n += '. User is offline.'),
                    ne.logError(n)
                }
              ),
              n
            )
          }
        }
        class ie {
          constructor(e) {
            this._quoteDataProvider = e
          }
          async getTimescaleMarks(e, t, s, n) {
            const o = [],
              i = e.name,
              r = await this._getQuoteValues(i)
            return r
              ? (this._populateEarningsMarkers(r, o, i, t, s), this._populateDividendsMarkers(r, o, i, t, s), o)
              : o
          }
          async getMarks(e, t, s, n) {
            return []
          }
          async _getQuoteValues(e) {
            const t = (await this._quoteDataProvider(e)).find((t) => t.n === e)
            return t && 'ok' === t.s ? t.v : null
          }
          _populateEarningsMarkers(e, t, s, n, o) {
            var i
            if (
              ((i = e),
              Boolean(
                i.earnings_release_date_fq_h &&
                  i.earnings_per_share_forecast_fq_h &&
                  i.earnings_fiscal_period_fq_h &&
                  i.earnings_per_share_fq_h
              ))
            )
              for (let i = 0; i < e.earnings_release_date_fq_h.length; i++) {
                const r = e.earnings_release_date_fq_h[i]
                if (r > o || r < n) continue
                const c = e.earnings_fiscal_period_fq_h[i],
                  a = e.earnings_per_share_forecast_fq_h[i],
                  l = e.earnings_per_share_fq_h[i],
                  h = l >= a
                t.push({
                  id: `${s}-E-${c}`,
                  time: r,
                  color: h ? 'green' : 'red',
                  label: 'E',
                  shape: h ? 'earningUp' : 'earningDown',
                  tooltip: [`Earnings \t ${c}`, `Forecast: \t ${a}`, `Actual: \t ${l}`],
                })
              }
          }
          _populateDividendsMarkers(e, t, s, n, o) {
            if (((i = e), !Boolean(i.dividend_ex_date_recent && i.dividend_amount_recent))) return
            var i
            const r = e.dividend_ex_date_recent
            if (r > o || r < n) return
            const c = e.dividend_amount_recent,
              a = e.dividend_payout_ratio_ttm,
              l = ['Dividends', `Ex Date: \t ${new Date(1e3 * r).toDateString()}`, `Amount: \t ${c.toFixed(2)}`]
            a && l.push(`Payout Ratio (TTM): ${a.toFixed()}%`),
              t.push({
                id: `${s}-D-${r}`,
                time: r,
                color: 'blue',
                label: 'D',
                shape: 'circle',
                tooltip: l,
              })
          }
        }
        const re = d.getInstance()
        const ce = new RegExp('^http(s)?://')
        class ae extends class {
          constructor(e, t, s, n, o, i) {
            ;(this._isConnected = !1),
              (this._wsBackendConnection = e),
              (this._historyProvider = t),
              (this._resolveProvider = s),
              (this._dataPulseProvider = n),
              (this._quotesProvider = o),
              (this._marksProvider = i),
              this._bindSocketEvents()
          }
          onReady(e) {
            ;(this._onReadyCallback = e),
              this._isConnected &&
                setTimeout(() => {
                  this._callOnReadyCallback()
                }, 0),
              this._wsBackendConnection.isConnected() ||
                this._wsBackendConnection.isConnecting() ||
                (this._wsBackendConnection.onReconnect(this._bindSocketEvents.bind(this)),
                this._wsBackendConnection.connect())
          }
          async searchSymbols(e, t, s, n) {
            const o = new URL('https://symbol-search.tradingview.com/local_search/')
            o.searchParams.set('text', e),
              o.searchParams.set('exchange', t),
              o.searchParams.set('type', s),
              o.searchParams.set('tradable', '1')
            try {
              const e = await oe(o.toString())
              if (!e.ok) throw new Error(`${e.status}: ${e.statusText}`)
              n(
                (await e.json()).map((e) => ({
                  ...j(e),
                  symbol: e.symbol,
                  description: e.description,
                  type: e.type,
                  exchange: e.exchange,
                  full_name: `${e.prefix || e.exchange}:${e.symbol}`,
                }))
              )
            } catch (e) {
              re.error(e), n([])
            }
          }
          resolveSymbol(e, t, s, n) {
            this._resolveProvider
              .resolveSymbol(e, n)
              .then((e) => t(e))
              .catch((e) => {
                e instanceof Error
                  ? s(e.message)
                  : s('An unknown error has occurred while trying to resolve the symbol.')
              })
          }
          getBars(e, t, s, n, o) {
            this._historyProvider
              .getBars(e, t, s)
              .then((e) => n(e.bars, e.meta))
              .catch((e) => {
                e instanceof Error
                  ? o(`An error has occurred within the datafeed. Error reported: ${e.message}`)
                  : o('An unknown error has occurred with the datafeed.')
              })
          }
          subscribeBars(e, t, s, n, o) {
            this._dataPulseProvider.subscribeBars(e, t, s, n)
          }
          unsubscribeBars(e) {
            this._dataPulseProvider.unsubscribeBars(e)
          }
          getQuotes(e, t, s) {
            this._quotesProvider.getQuotes(e, t, s)
          }
          subscribeQuotes(e, t, s, n) {
            this._quotesProvider.subscribeQuotes(e, t, s, n)
          }
          unsubscribeQuotes(e) {
            this._quotesProvider.unsubscribeQuotes(e)
          }
          async getTimescaleMarks(e, t, s, n, o) {
            n(await this._marksProvider.getTimescaleMarks(e, t, s, o))
          }
          _bindSocketEvents() {
            this._wsBackendConnection.on('connect', () => {
              this._onConnect()
            }),
              this._wsBackendConnection.on('disconnect', () => {
                re.error('disconnect')
              })
          }
          _onConnect() {
            this._isConnected
              ? re.error('_onConnected called again')
              : (this._wsBackendConnection.send(
                  JSON.stringify({
                    m: 'set_auth_token',
                    p: ['widget_user_token'],
                  })
                ),
                (this._isConnected = !0),
                this._onReadyCallback && this._callOnReadyCallback())
          }
          _callOnReadyCallback() {
            this._onReadyCallback && this._onReadyCallback(V)
          }
        } {
          constructor(e = 1e4, t, s) {
            re.setLoggingEnabled(t || !1),
              (window.WEBSOCKET_PARAMS_ANALYTICS = {
                ws_page_uri: window.location.href.replace(ce, ''),
              })
            const n =
              window.location.ancestorOrigins && window.location.ancestorOrigins.length
                ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1].replace(ce, '')
                : null
            n && (window.WEBSOCKET_PARAMS_ANALYTICS.ws_ancestor_origin = n)
            const o = new l(null != s ? s : 'widgetdata.tradingview.com'),
              i = new se(o),
              r = new z(o, i),
              c = new h(r, e),
              a = new ie((e) => i.getQuoteData(e))
            super(o, r, r, c, i, a)
          }
        }
      })(),
      n
    )
  })()
)
