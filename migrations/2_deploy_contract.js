const BatchDeposit = artifacts.require('BatchDeposit');
const DepositMock = artifacts.require('DepositMock');

module.exports = async function (deployer, network, accounts) {
    let deposit_contract_address = '';

    if (network === 'development') {
	// Development environment is special as there is no deposit
	// contract, we deploy the openzeppelin mock one.
	await deployer.deploy(DepositMock);
	deposit_contract_address = await DepositMock.address;
    } else if (network === 'goerli' || network == 'goerli-fork') {
	// https://goerli.etherscan.io/address/0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b
	deposit_contract_address = '0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b';
    } else if (network === 'holesky' || network == 'holesky-fork') {
	deposit_contract_address = '0x4242424242424242424242424242424242424242'
    } else if (network === 'mainnet' || network === 'mainnet-fork') {
	// https://etherscan.io/address/0x00000000219ab540356cbb839cbe05303d7705fa
	deposit_contract_address = '0x00000000219ab540356cbb839cbe05303d7705fa';
    } else {
	throw new Error("Unsupported network target for deployment, must be: 'development', 'goerli' or 'mainnet', got '" + network + "'");
    }

    await deployer.deploy(BatchDeposit, deposit_contract_address);
};
