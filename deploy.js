const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const provider = new HDWalletProvider(
    ["xxxxxxxxxxxxxxxxx"],
    'https://goerli.infura.io/v3/xxxxxxxxxxxxxxxxxxxxxx'
);

const web3 = new Web3(provider);

const contract = require('./compiled.json').contracts["contract.sol"].BatchDeposit;

(async () => {
    const accounts = await web3.eth.getAccounts();

    console.log(`Attempting to deploy from account: ${accounts[0]}`);
    const deployedContract = await new web3.eth.Contract(contract.abi)
		.deploy({
			data: '0x' + contract.evm.bytecode.object,
			arguments: null
		})
		.send({
			from: accounts[0],
			gas: '3000000'
		});
    console.log(
        `Contract deployed at address: ${deployedContract.options.address}`
    );
    provider.engine.stop();
})();
