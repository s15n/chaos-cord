import isElectron from "is-electron";
import { setVoiceState } from "../../App";
import { dateToHHMMSS } from "../../utils";

export class DiscordVoiceWs {
    readonly sessionId: string
    readonly userId: string
    readonly server: { endpoint: string, guild_id: string, token: string }

    latency: number | undefined
    socket: WebSocket | undefined

    private hbInterval!: number
    private hbTimerId!: number
    private lastHb!: number
    private hbNonce: number | undefined
    private wrongHbNonces = 0

    connect(resume: boolean = false) {
        console.log(resume ? 'VWS Resuming...' : 'Voice Websocket start')

        const socket = new WebSocket(`wss://${this.server.endpoint}/?v=5`)

        socket.addEventListener('open', () => {
            console.log('Connected to VWS');
            this.socket = socket

            if (resume) this.resume()
            else this.identify()
        })

        socket.addEventListener('close', event => {
            console.warn(`VWS closed! "${event.reason}", Code: ${event.code}`)
            window.clearInterval(this.hbTimerId)

            if (event.code > 2000) this.connect(true) 
            else setVoiceState(null)
        })

        socket.addEventListener('message', event => {
            if (!this.socket) {
                console.warn('UNHANDLED MESSAGE')
            }

            const object: any = JSON.parse(event.data)
            console.debug(object)
            const op: number = object.op
            const d: any = object.d

            switch(op) {
            case 8:
                this.handleHeartbeatInterval(d)
                break
            case 2:
                this.handleReady(d)
                break
            case 6:
                this.latency = Date.now() - this.lastHb
                if (d !== this.hbNonce) {
                    console.warn('Wrong VWS heartbeat nonce!')
                    ++this.wrongHbNonces
                    if (this.wrongHbNonces > 3) {
                        console.error('Too many wrong heartbeat VWS nonces! Closing.')
                        this.close()
                    }
                } else {
                    this.wrongHbNonces = 0
                }
                console.debug(`...Received (latency: ${this.latency})`)
                break
            case 4:
                console.log('Secret Key: ', d.secret_key)
                window.electron.udpKey(d.secret_key)
                break
            default:
                console.log('Unknown VWS event:')
                console.log(event)
            }
        })

        setVoiceState({ state: 'VWS', vws: this })
    }

    close() {
        if (!this.socket) {
            console.warn('Tried to close closed VWS')
            return
        }
        console.log('Closing VWS')
        this.socket.close(1000)

        window.electron.disconnectUDP()
    }
    
    send(op: number, data: {}) {
        const payload = JSON.stringify({
            op: op,
            d: data
        })
        console.log(`[VOICE] >>> ${payload}`)
        this.socket?.send(payload)
    }

    private identify() {
        console.log('Voice identify...')
        this.send(0, {
            server_id: this.server.guild_id,
            user_id: this.userId,
            session_id: this.sessionId,
            token: this.server.token,
            video: false
        })
    }

    private resume() {
        console.error('RESUME NOT IMPLEMENTED') // TODO
        this.close()
        return
        this.send(7, {
          server_id: this.server.guild_id,
          session_id: this.sessionId,
          token: this.server.token
        })
    }

    private handleReady(d: {
        ssrc: number
        ip: string
        port: number
        modes: string[]
    }) {
        console.log(`VWS ready! (${d.ip}:${d.port} ssrc: ${d.ssrc})`)
        setVoiceState({ state: 'VWS_READY'})

        if (isElectron()) {
            window.electron.udp(d.ip, d.port, d.ssrc)
            window.electron.setUdpReplyHandler((publicIp, publicPort) => {
                console.log(`Select voice protocol at ${publicIp}:${publicPort}`)
                this.send(1, {
                    protocol: 'udp',
                    data: {
                        address: publicIp,
                        port: publicPort,
                        mode: 'xsalsa20_poly1305_lite'
                    }
                })
                setVoiceState({ state: 'CONNECTED' })
            })
            //udp(d.ip, d.port)
        }
    }

    private handleHeartbeatInterval(d: { heartbeat_interval: number }) {
        this.hbInterval = d.heartbeat_interval
        console.log(`Heartbeat interval: ${this.hbInterval}`)
        this.hbTimerId = window.setInterval(() => {
            this.lastHb = this.heartbeat()
        }, this.hbInterval)
        window.currentDiscordVWSHbTimerId = this.hbTimerId
        console.log(window.currentDiscordVWSHbTimerId)
    }

    private heartbeat() {
        if (this.hbTimerId !== window.currentDiscordVWSHbTimerId) {
            window.clearInterval(this.hbTimerId)
        } else {
            console.debug(`[${dateToHHMMSS(new Date())}]: VWS Heartbeat... (${this.sessionId})`)
            const nonce = Math.floor(Math.random() * 100_000_000) + 1633275000000
            this.socket?.send(JSON.stringify({
                op: 3,
                d: nonce
            }))
            this.hbNonce = nonce
        }
        return Date.now()
    }

    constructor(sessionId: string, userId: string, server: { endpoint: string, guild_id: string, token: string }) {
        this.sessionId = sessionId
        this.userId = userId
        this.server = server
    }
}

/*
const d = {
            "server_id": "581185346465824768",
            "user_id": "353603367907360768",
            "session_id": "cbd5281439ef4505b7d2c477558930d0",
            "token": "b5fd4649e8f2c618",
            "video": true,
            "streams": [
              {
                "type": "video",
                "rid": "100",
                "quality": 100
              },
              {
                "type": "video",
                "rid": "50",
                "quality": 50
              }
            ]
          }}*/