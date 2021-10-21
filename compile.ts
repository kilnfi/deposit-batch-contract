const fs = require('fs-extra');
const solc = require('solc');

const input = {
	language: 'Solidity',
	sources: {
		'contract.sol' : {
			content: fs.readFileSync('./contract.sol', 'utf8')
		},
	},
	settings: {
		outputSelection: {
			'*': {
				'*': [ 'abi', 'evm.bytecode' ]
			}
		}
	}
};

(() => {
	const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));

	fs.writeJsonSync(
		'./compiled.json',
		compiledContract,
		{
			spaces: 2
		}
	);
})();
