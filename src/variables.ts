import type ModuleInstance from './main.js'

export type VariablesSchema = {
	model: string
	version: string
	serialNumber: string
	timestamp: string
	input1State: string
	input1Count: string
	input2State: string
	input2Count: string
	input3State: string
	input3Count: string
	input4State: string
	input4Count: string
	input5State: string
	input5Count: string
	input6State: string
	input6Count: string
	input7State: string
	input7Count: string
	input8State: string
	input8Count: string
	input9State: string
	input9Count: string
	input10State: string
	input10Count: string
	input11State: string
	input11Count: string
	input12State: string
	input12Count: string
	input13State: string
	input13Count: string
	input14State: string
	input14Count: string
	input15State: string
	input15Count: string
	input16State: string
	input16Count: string
	input17State: string
	input17Count: string
	input18State: string
	input18Count: string
	input19State: string
	input19Count: string
	input20State: string
	input20Count: string
	input21State: string
	input21Count: string
	input22State: string
	input22Count: string
	input23State: string
	input23Count: string
	input24State: string
	input24Count: string
	input25State: string
	input25Count: string
	input26State: string
	input26Count: string
	input27State: string
	input27Count: string
	input28State: string
	input28Count: string
	output1State: string
	output2State: string
	output3State: string
	output4State: string
	output5State: string
	output6State: string
	output7State: string
	output8State: string
	output9State: string
	output10State: string
	output11State: string
	output12State: string
	output13State: string
	output14State: string
	output15State: string
	output16State: string
	output17State: string
	output18State: string
	output19State: string
	output20State: string
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions({
		model: { name: 'JNIOR Model' },
		version: { name: 'JANOS Version' },
		serialNumber: { name: 'Serial Number' },
		timestamp: { name: 'Monitor Timestamp' },
		input1State: { name: 'Input 1 State' },
		input1Count: { name: 'Input 1 Count' },
		input2State: { name: 'Input 2 State' },
		input2Count: { name: 'Input 2 Count' },
		input3State: { name: 'Input 3 State' },
		input3Count: { name: 'Input 3 Count' },
		input4State: { name: 'Input 4 State' },
		input4Count: { name: 'Input 4 Count' },
		input5State: { name: 'Input 5 State' },
		input5Count: { name: 'Input 5 Count' },
		input6State: { name: 'Input 6 State' },
		input6Count: { name: 'Input 6 Count' },
		input7State: { name: 'Input 7 State' },
		input7Count: { name: 'Input 7 Count' },
		input8State: { name: 'Input 8 State' },
		input8Count: { name: 'Input 8 Count' },
		input9State: { name: 'Input 9 State' },
		input9Count: { name: 'Input 9 Count' },
		input10State: { name: 'Input 10 State' },
		input10Count: { name: 'Input 10 Count' },
		input11State: { name: 'Input 11 State' },
		input11Count: { name: 'Input 11 Count' },
		input12State: { name: 'Input 12 State' },
		input12Count: { name: 'Input 12 Count' },
		input13State: { name: 'Input 13 State' },
		input13Count: { name: 'Input 13 Count' },
		input14State: { name: 'Input 14 State' },
		input14Count: { name: 'Input 14 Count' },
		input15State: { name: 'Input 15 State' },
		input15Count: { name: 'Input 15 Count' },
		input16State: { name: 'Input 16 State' },
		input16Count: { name: 'Input 16 Count' },
		input17State: { name: 'Input 17 State' },
		input17Count: { name: 'Input 17 Count' },
		input18State: { name: 'Input 18 State' },
		input18Count: { name: 'Input 18 Count' },
		input19State: { name: 'Input 19 State' },
		input19Count: { name: 'Input 19 Count' },
		input20State: { name: 'Input 20 State' },
		input20Count: { name: 'Input 20 Count' },
		input21State: { name: 'Input 21 State' },
		input21Count: { name: 'Input 21 Count' },
		input22State: { name: 'Input 22 State' },
		input22Count: { name: 'Input 22 Count' },
		input23State: { name: 'Input 23 State' },
		input23Count: { name: 'Input 23 Count' },
		input24State: { name: 'Input 24 State' },
		input24Count: { name: 'Input 24 Count' },
		input25State: { name: 'Input 25 State' },
		input25Count: { name: 'Input 25 Count' },
		input26State: { name: 'Input 26 State' },
		input26Count: { name: 'Input 26 Count' },
		input27State: { name: 'Input 27 State' },
		input27Count: { name: 'Input 27 Count' },
		input28State: { name: 'Input 28 State' },
		input28Count: { name: 'Input 28 Count' },
		output1State: { name: 'Relay 1 State' },
		output2State: { name: 'Relay 2 State' },
		output3State: { name: 'Relay 3 State' },
		output4State: { name: 'Relay 4 State' },
		output5State: { name: 'Relay 5 State' },
		output6State: { name: 'Relay 6 State' },
		output7State: { name: 'Relay 7 State' },
		output8State: { name: 'Relay 8 State' },
		output9State: { name: 'Relay 9 State' },
		output10State: { name: 'Relay 10 State' },
		output11State: { name: 'Relay 11 State' },
		output12State: { name: 'Relay 12 State' },
		output13State: { name: 'Relay 13 State' },
		output14State: { name: 'Relay 14 State' },
		output15State: { name: 'Relay 15 State' },
		output16State: { name: 'Relay 16 State' },
		output17State: { name: 'Relay 17 State' },
		output18State: { name: 'Relay 18 State' },
		output19State: { name: 'Relay 19 State' },
		output20State: { name: 'Relay 20 State' },
	})
}
