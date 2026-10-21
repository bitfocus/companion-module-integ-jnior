import type ModuleInstance from './main.js'

type HexColor = string
const hexToNumber = (value: HexColor): number => Number.parseInt(value.slice(1), 16)

export type FeedbacksSchema = {
	fbkInputRelayState: {
		type: 'boolean'
		options: { input: number }
	}
	fbkOutputRelayState: {
		type: 'boolean'
		options: { output: number }
	}
}

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		fbkInputRelayState: {
			type: 'boolean',
			name: 'Digital Input is Closed',
			defaultStyle: {
				bgcolor: hexToNumber('#ffff00'),
				color: hexToNumber('#000000'),
			},
			options: [
				{
					id: 'input',
					type: 'number',
					label: 'Input',
					default: 1,
					min: 1,
					max: 28,
					clampValues: true,
				},
			],
			callback: (feedback) => {
				const relay = feedback.options.input

				return self.getVariableValue(`input${relay}State`) === '1'
			},
		},
		fbkOutputRelayState: {
			type: 'boolean',
			name: 'Relay Output is Closed',
			defaultStyle: {
				bgcolor: hexToNumber('#ffff00'),
				color: hexToNumber('#000000'),
			},
			options: [
				{
					id: 'output',
					type: 'number',
					label: 'Output',
					default: 1,
					min: 1,
					max: 20,
					clampValues: true,
				},
			],
			callback: (feedback) => {
				const relay = feedback.options.output

				return self.getVariableValue(`output${relay}State`) === '1'
			},
		},
	})
}
