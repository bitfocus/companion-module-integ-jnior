import { createHash } from 'node:crypto'
import { InstanceBase, InstanceStatus, TCPHelper, type SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig, type ModuleSecrets } from './config.js'
import { UpdateVariableDefinitions, type VariablesSchema } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions, type ActionsSchema } from './actions.js'
import { UpdateFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { UpdatePresets } from './presets.js'

const CONNECT_TIMEOUT_MS = 15_000
const AUTHENTICATION_TIMEOUT_MS = 15_000
const TCP_KEEPALIVE_INITIAL_DELAY_MS = 10_000
const RECONNECT_DELAYS_MS = [1_000, 2_000, 5_000, 10_000, 15_000, 30_000, 60_000]

export type ModuleSchema = {
	config: ModuleConfig
	secrets: ModuleSecrets
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export { UpgradeScripts }

export default class ModuleInstance extends InstanceBase<ModuleSchema> {
	config!: ModuleConfig // Setup in init()
	secrets!: ModuleSecrets
	private tcp: TCPHelper | undefined
	private receiveBuffer = Buffer.alloc(0)
	private authenticated = false
	private connectionTimeout: NodeJS.Timeout | undefined
	private reconnectTimer: NodeJS.Timeout | undefined
	private reconnectAttempt = 0

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig, _isFirstInit: boolean, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets

		this.updateActions()
		this.updateFeedbacks() // export feedbacks
		this.updatePresets() // export Presets
		this.updateVariableDefinitions() // export variable definitions
		this.initConnection()
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.destroyConnection()
	}

	async configUpdated(config: ModuleConfig, secrets: ModuleSecrets): Promise<void> {
		this.config = config
		this.secrets = secrets
		this.updateActions()
		this.updateFeedbacks()
		this.initConnection()
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	public sendControl(
		command: 'Close' | 'Open' | 'Toggle' | 'Reset Latch' | 'Reset Counter' | 'Reset Usage',
		channel: number,
		duration?: number,
		latchTime?: number,
	): void {
		if (!this.authenticated) {
			this.log('warn', 'Cannot control relay before JMP authentication completes')
			return
		}
		this.sendMessage({
			Message: 'Control',
			Command: command,
			Channel: channel,
			...(duration === undefined ? {} : { Duration: duration }),
			...(latchTime === undefined ? {} : { 'Latch Time': latchTime }),
		})
	}

	public sendConsoleCommand(command: string, lineEnding: '\r' | '\n' | '\r\n'): void {
		if (!this.authenticated) {
			this.log('warn', 'Cannot send console command before JMP authentication completes')
			return
		}

		const payload = `${command}${lineEnding}`
		this.sendMessage({ Message: 'Console Open' })
		this.sendMessage({
			Message: 'Console Stdin',
			Data: payload,
		})
		this.sendMessage({ Message: 'Console Close' })
	}

	private initConnection(): void {
		this.destroyConnection()
		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig, 'Target IP is required')
			return
		}

		this.updateStatus(InstanceStatus.Connecting)
		const tcp = new TCPHelper(this.config.host, this.config.port, { reconnect: false })
		this.tcp = tcp
		tcp._socket.setKeepAlive(true, TCP_KEEPALIVE_INITIAL_DELAY_MS)
		tcp.on('connect', () => {
			this.clearConnectionTimeout()
			this.authenticated = false
			this.receiveBuffer = Buffer.alloc(0)
			this.updateStatus(InstanceStatus.Connecting, 'Connected; authenticating')
			this.startConnectionTimeout(tcp, AUTHENTICATION_TIMEOUT_MS, 'JMP authentication timed out')
			this.sendMessage({ Message: '' })
		})
		tcp.on('data', (data) => this.handleData(data))
		tcp.on('error', (error) => {
			this.log('error', `Connection error: ${error.message}`)
		})
		tcp.on('status_change', (status, message) => {
			if (status === InstanceStatus.Ok) return
			if (this.tcp !== tcp) return

			this.clearConnectionTimeout()
			this.authenticated = false
			this.receiveBuffer = Buffer.alloc(0)
			this.updateStatus(status, message)
			if (status === InstanceStatus.Connecting) {
				this.startConnectionTimeout(tcp, CONNECT_TIMEOUT_MS, 'TCP connection timed out')
			} else {
				this.scheduleReconnect()
			}
		})
		this.startConnectionTimeout(tcp, CONNECT_TIMEOUT_MS, 'TCP connection timed out')
	}

	private destroyConnection(): void {
		this.clearConnectionTimeout()
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = undefined
		}
		this.tcp?.destroy()
		this.tcp = undefined
		this.authenticated = false
		this.receiveBuffer = Buffer.alloc(0)
	}

	private startConnectionTimeout(tcp: TCPHelper, timeoutMs: number, message: string): void {
		this.clearConnectionTimeout()
		this.connectionTimeout = setTimeout(() => {
			this.connectionTimeout = undefined
			if (this.tcp !== tcp) return

			this.log('warn', `${message}; retrying connection`)
			this.updateStatus(InstanceStatus.ConnectionFailure, message)
			tcp.destroy()
			this.tcp = undefined
			this.authenticated = false
			this.receiveBuffer = Buffer.alloc(0)
			this.scheduleReconnect()
		}, timeoutMs)
	}

	private scheduleReconnect(): void {
		if (this.reconnectTimer) return

		const delay = RECONNECT_DELAYS_MS[Math.min(this.reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)]
		this.reconnectAttempt = Math.min(this.reconnectAttempt + 1, RECONNECT_DELAYS_MS.length - 1)
		this.log('warn', `Retrying connection in ${delay / 1000} seconds`)
		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = undefined
			this.initConnection()
		}, delay)
	}

	private clearConnectionTimeout(): void {
		if (this.connectionTimeout) {
			clearTimeout(this.connectionTimeout)
			this.connectionTimeout = undefined
		}
	}

	private sendMessage(message: Record<string, unknown>): void {
		if (!this.tcp?.isConnected) {
			this.log('warn', 'Cannot send JMP message while disconnected')
			return
		}

		const json = JSON.stringify(message)
		const frame = `[${Buffer.byteLength(json, 'utf8')},${json}]`
		if (!this.tcp.send(frame)) {
			this.log('warn', 'Cannot send JMP message while disconnected')
		}
	}

	private handleData(data: Buffer): void {
		this.receiveBuffer = Buffer.concat([this.receiveBuffer, data])
		while (true) {
			const message = this.extractMessage()
			if (!message) return
			this.handleMessage(message)
		}
	}

	private extractMessage(): Record<string, unknown> | undefined {
		const start = this.receiveBuffer.indexOf(0x5b)
		if (start < 0) {
			this.receiveBuffer = Buffer.alloc(0)
			return undefined
		}
		if (start > 0) this.receiveBuffer = this.receiveBuffer.subarray(start)

		let index = 1
		while (index < this.receiveBuffer.length && /\s/.test(String.fromCharCode(this.receiveBuffer[index]))) index++
		const lengthStart = index
		while (
			index < this.receiveBuffer.length &&
			this.receiveBuffer[index] >= 0x30 &&
			this.receiveBuffer[index] <= 0x39
		) {
			index++
		}
		if (index === lengthStart) return undefined
		if (index >= this.receiveBuffer.length) return undefined
		const length = Number(this.receiveBuffer.subarray(lengthStart, index).toString('ascii'))
		while (index < this.receiveBuffer.length && /\s/.test(String.fromCharCode(this.receiveBuffer[index]))) index++
		if (index >= this.receiveBuffer.length) return undefined
		if (this.receiveBuffer[index] !== 0x2c || length < 2) {
			this.receiveBuffer = this.receiveBuffer.subarray(1)
			return {}
		}
		index++
		while (index < this.receiveBuffer.length && /\s/.test(String.fromCharCode(this.receiveBuffer[index]))) index++
		if (this.receiveBuffer.length < index + length + 1) return undefined
		const jsonBuffer = this.receiveBuffer.subarray(index, index + length)
		const closingIndex = index + length
		let end = closingIndex + 1
		while (end < this.receiveBuffer.length && /\s/.test(String.fromCharCode(this.receiveBuffer[end]))) end++
		if (jsonBuffer[0] !== 0x7b || jsonBuffer[length - 1] !== 0x7d || this.receiveBuffer[closingIndex] !== 0x5d) {
			this.receiveBuffer = this.receiveBuffer.subarray(1)
			return {}
		}
		this.receiveBuffer = this.receiveBuffer.subarray(end)
		try {
			return JSON.parse(jsonBuffer.toString('utf8')) as Record<string, unknown>
		} catch {
			return {}
		}
	}

	private handleMessage(message: Record<string, unknown>): void {
		const type = message.Message
		if (type === 'Error' && message.Nonce) {
			const innerDigest = createHash('md5')
				.update(`${this.config.username}:${this.toVariableString(message.Nonce)}:${this.secrets.password}`)
				.digest('hex')
			this.sendMessage({ 'Auth-Digest': `${this.config.username}:${innerDigest}` })
			return
		}
		if (type === 'Authenticated') {
			this.clearConnectionTimeout()
			this.authenticated = true
			this.reconnectAttempt = 0
			this.updateStatus(InstanceStatus.Ok)
			return
		}
		if (type === 'Monitor') this.updateMonitor(message)
	}

	private updateMonitor(message: Record<string, unknown>): void {
		const values: Record<string, string> = {
			model: this.toVariableString(message.Model),
			version: this.toVariableString(message.Version),
			serialNumber: this.toVariableString(message['Serial Number']),
			timestamp: this.toVariableString(message.Timestamp),
		}
		const inputs = Array.isArray(message.Inputs) ? message.Inputs : []
		for (let index = 0; index < 28; index++) {
			const input = inputs[index] as Record<string, unknown> | undefined
			values[`input${index + 1}State`] = this.toVariableString(input?.State)
			values[`input${index + 1}Count`] = this.toVariableString(input?.Count)
		}
		const outputs = Array.isArray(message.Outputs) ? message.Outputs : []
		for (let index = 0; index < Math.min(outputs.length, 20); index++) {
			const output = outputs[index] as Record<string, unknown> | undefined
			values[`output${index + 1}State`] = this.toVariableString(output?.State)
		}
		this.setVariableValues(values)
		this.checkFeedbacks('fbkInputRelayState', 'fbkOutputRelayState')
	}

	private toVariableString(value: unknown): string {
		if (value === undefined || value === null) return ''
		if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)
		return JSON.stringify(value)
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}
