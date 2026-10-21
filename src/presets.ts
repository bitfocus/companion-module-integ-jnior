import type { ModuleSchema } from './main.js'
import type ModuleInstance from './main.js'
import type { CompanionPresetDefinitions, CompanionPresetSection } from '@companion-module/base'

type HexColor = string
const hexToNumber = (value: HexColor): number => Number.parseInt(value.slice(1), 16)

export function UpdatePresets(self: ModuleInstance): void {
	const structure: CompanionPresetSection[] = [
		{
			id: 'setRelayOutputs',
			name: 'Set Relay Outputs',
			definitions: [
				{
					id: 'relayOpen',
					name: 'Open Relay Output',
					type: 'template',
					presetId: 'outputStateOpen',
					templateVariableName: 'output',
					templateValues: [
						{ name: `Open Relay Output 1`, value: '1' },
						{ name: `Open Relay Output 2`, value: '2' },
						{ name: `Open Relay Output 3`, value: '3' },
						{ name: `Open Relay Output 4`, value: '4' },
						{ name: `Open Relay Output 5`, value: '5' },
						{ name: `Open Relay Output 6`, value: '6' },
						{ name: `Open Relay Output 7`, value: '7' },
						{ name: `Open Relay Output 8`, value: '8' },
						{ name: `Open Relay Output 9`, value: '9' },
						{ name: `Open Relay Output 10`, value: '10' },
						{ name: `Open Relay Output 11`, value: '11' },
						{ name: `Open Relay Output 12`, value: '12' },
						{ name: `Open Relay Output 13`, value: '13' },
						{ name: `Open Relay Output 14`, value: '14' },
						{ name: `Open Relay Output 15`, value: '15' },
						{ name: `Open Relay Output 16`, value: '16' },
						{ name: `Open Relay Output 17`, value: '17' },
						{ name: `Open Relay Output 18`, value: '18' },
						{ name: `Open Relay Output 19`, value: '19' },
						{ name: `Open Relay Output 20`, value: '20' },
					],
				},
				{
					id: 'relayClose',
					name: 'Close Relay Output',
					type: 'template',
					presetId: 'outputStateClose',
					templateVariableName: 'output',
					templateValues: [
						{ name: `Close Relay Output 1`, value: '1' },
						{ name: `Close Relay Output 2`, value: '2' },
						{ name: `Close Relay Output 3`, value: '3' },
						{ name: `Close Relay Output 4`, value: '4' },
						{ name: `Close Relay Output 5`, value: '5' },
						{ name: `Close Relay Output 6`, value: '6' },
						{ name: `Close Relay Output 7`, value: '7' },
						{ name: `Close Relay Output 8`, value: '8' },
						{ name: `Close Relay Output 9`, value: '9' },
						{ name: `Close Relay Output 10`, value: '10' },
						{ name: `Close Relay Output 11`, value: '11' },
						{ name: `Close Relay Output 12`, value: '12' },
						{ name: `Close Relay Output 13`, value: '13' },
						{ name: `Close Relay Output 14`, value: '14' },
						{ name: `Close Relay Output 15`, value: '15' },
						{ name: `Close Relay Output 16`, value: '16' },
						{ name: `Close Relay Output 17`, value: '17' },
						{ name: `Close Relay Output 18`, value: '18' },
						{ name: `Close Relay Output 19`, value: '19' },
						{ name: `Close Relay Output 20`, value: '20' },
					],
				},
			],
		},
		{
			id: 'pulseRelayOutputs',
			name: 'Pulse Relay Outputs',
			definitions: [
				{
					id: 'relayPulse',
					name: 'Pulse Relay Output',
					type: 'template',
					presetId: 'outputStatePulse',
					templateVariableName: 'output',
					templateValues: [
						{ name: `Pulse Relay Output 1`, value: '1' },
						{ name: `Pulse Relay Output 2`, value: '2' },
						{ name: `Pulse Relay Output 3`, value: '3' },
						{ name: `Pulse Relay Output 4`, value: '4' },
						{ name: `Pulse Relay Output 5`, value: '5' },
						{ name: `Pulse Relay Output 6`, value: '6' },
						{ name: `Pulse Relay Output 7`, value: '7' },
						{ name: `Pulse Relay Output 8`, value: '8' },
						{ name: `Pulse Relay Output 9`, value: '9' },
						{ name: `Pulse Relay Output 10`, value: '10' },
						{ name: `Pulse Relay Output 11`, value: '11' },
						{ name: `Pulse Relay Output 12`, value: '12' },
						{ name: `Pulse Relay Output 13`, value: '13' },
						{ name: `Pulse Relay Output 14`, value: '14' },
						{ name: `Pulse Relay Output 15`, value: '15' },
						{ name: `Pulse Relay Output 16`, value: '16' },
						{ name: `Pulse Relay Output 17`, value: '17' },
						{ name: `Pulse Relay Output 18`, value: '18' },
						{ name: `Pulse Relay Output 19`, value: '19' },
						{ name: `Pulse Relay Output 20`, value: '20' },
					],
				},
			],
		},
	]

	const presets: CompanionPresetDefinitions<ModuleSchema> = {}
	presets['outputStateOpen'] = {
		name: `Open Relay Output $(local:output)`,
		type: 'simple',
		style: {
			text: 'Open Relay Output $(local:output)',
			size: '14',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		feedbacks: [
			{
				feedbackId: 'fbkOutputRelayState',
				options: { output: { isExpression: true, value: '$(local:output)' } },
				style: {
					bgcolor: hexToNumber('#FFFF00'),
					color: hexToNumber('#000000'),
				},
			},
		],
		steps: [
			{
				down: [
					{
						actionId: 'set_relay',
						options: {
							command: 'Open',
							channel: { isExpression: true, value: '$(local:output)' },
						},
					},
				],
				up: [],
			},
		],
		localVariables: [
			{
				variableType: 'simple',
				variableName: 'output',
				startupValue: 1,
			},
		],
	}

	presets['outputStateClose'] = {
		name: `Close Relay Output $(local:output)`,
		type: 'simple',
		style: {
			text: 'Close Relay Output $(local:output)',
			size: '14',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		feedbacks: [
			{
				feedbackId: 'fbkOutputRelayState',
				options: { output: { isExpression: true, value: '$(local:output)' } },
				style: {
					bgcolor: hexToNumber('#FFFF00'),
					color: hexToNumber('#000000'),
				},
			},
		],
		steps: [
			{
				down: [
					{
						actionId: 'set_relay',
						options: {
							command: 'Close',
							channel: { isExpression: true, value: '$(local:output)' },
						},
					},
				],
				up: [],
			},
		],
		localVariables: [
			{
				variableType: 'simple',
				variableName: 'output',
				startupValue: 1,
			},
		],
	}

	presets['outputStatePulse'] = {
		name: `Pulse Relay Output $(local:output)`,
		type: 'simple',
		style: {
			text: 'Pulse Relay Output $(local:output)',
			size: '14',
			color: 0xffffff,
			bgcolor: 0x000000,
		},
		feedbacks: [
			{
				feedbackId: 'fbkOutputRelayState',
				options: { output: { isExpression: true, value: '$(local:output)' } },
				style: {
					bgcolor: hexToNumber('#FFFF00'),
					color: hexToNumber('#000000'),
				},
			},
		],
		steps: [
			{
				down: [
					{
						actionId: 'pulse_relay',
						options: {
							channel: { isExpression: true, value: '$(local:output)' },
							duration: 1000,
						},
					},
				],
				up: [],
			},
		],
		localVariables: [
			{
				variableType: 'simple',
				variableName: 'output',
				startupValue: 1,
			},
		],
	}

	self.setPresetDefinitions(structure, presets)
}
