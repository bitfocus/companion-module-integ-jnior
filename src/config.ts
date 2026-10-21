import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export type ModuleConfig = {
	host: string
	port: number
	username: string
}

export type ModuleSecrets = {
	password: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			label: 'Device Configuration',
			value: `Enter the JNIOR device IP address and Target port. Target Port should remain 9220 unless you have specifically configured the JANOS Management Protocol (JMP) server otherwise. "JMP Server Configuration" must be enabled from the Web UI, with the "Server Enabled" checkbox ticked.  The login credentials are the same as those used to connect to the JNIOR's Web UI.`,
			width: 12,
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Target Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 9220,
		},
		{
			type: 'textinput',
			id: 'username',
			label: 'Username',
			width: 6,
			default: 'admin',
		},
		{
			type: 'secret-text',
			id: 'password',
			label: 'Password',
			width: 6,
		},
	]
}
