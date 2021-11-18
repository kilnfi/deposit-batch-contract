const truffleAssert = require('truffle-assertions');

const BatchDeposit = artifacts.require("BatchDeposit");

// Dummy data generated on Goerli.
var data = {
    pubkeys: [
	'0xb83220fe0d493ec6219bb47edd0cc8f3cf18e0dc0957b415cdf44a32d4461478a039859b53d72c04f22aba595cb89253',
	'0x96830cb3a66f8de3944db81149d7b5f1c6fce7ec1f489d57873ad0c6b045f3829cb53cc0f133e3d52914e9707d6e5a39'
    ],
    credentials: [
	'0x010000000000000000000000e0eb7763c0fee7299030b6a6068c78211e4c3972',
	'0x010000000000000000000000e0eb7763c0fee7299030b6a6068c78211e4c3972'
    ],
    signatures: [
	'0xaca21f4e31269041f5de95b1f7efa58d3a21b366fb0d7b438ef6cb39ee45f35c7092fa98746b6c5c29cbb751c1ce598308064eebd80e95dcf34f1b3054b7ca1a79e6209e21fd86f6dbc0645328d61aec07f0c9fca9ee05a20e30783b8c8dd9a1',
	'0xb192eb773196204879ca9883ba11fc91ec89fe70fb39338140dab2f0d1c0a9ad6f7625bf2d3e50d38e007527bd2e4a7c045bfcee3178f87ebe1bd4a4dd95d540a50717504595049e74ddce36499556dfbeda04fc31917ddd658405363bc3fbdc'
    ],
    data_roots: [
	'0x94930ff2e07838abb8ad8259fa4b1337a787f39f66ebc27f1cb4b8a0b3158199',
	'0x38cb41d353aabb2ad4a870ce844df58bb929cb0f55ccd28eb9978ac5db7e406e'
    ]
};

contract("BatchDeposit", accounts => {

    it("should handle multiple deposits at once", async () => {
	let batch = await BatchDeposit.deployed();

	var amount_eth = web3.utils.toBN(32 * 2);
	var amount_wei = new web3.utils.BN(web3.utils.toWei(amount_eth, "ether"));
	var account = accounts[2];

	let deposit = await batch.batchDeposit(data.pubkeys, data.credentials, data.signatures, data.data_roots, {
	    'value': amount_wei,
	    'from': account
	});

	truffleAssert.eventEmitted(deposit, 'LogDepositSent', (ev) => {
	    return ev.pubkey === data.pubkeys[0] && ev.withdrawal == data.credentials[0];
	}, "Should have processed the first deposit");

	truffleAssert.eventEmitted(deposit, 'LogDepositSent', (ev) => {
	    return ev.pubkey === data.pubkeys[1] && ev.withdrawal == data.credentials[1];
	}, "Should have processed the second deposit");

	truffleAssert.eventNotEmitted(deposit, 'LogDepositLeftover');
    });

    it("should handle leftovers", async () => {
	let batch = await BatchDeposit.deployed();

	// Send 40 ether but only 1 address for the deposit, we expect
	// to get back 8 ether from the contract.
	var amount_eth = web3.utils.toBN(40);
	var amount_wei = new web3.utils.BN(web3.utils.toWei(amount_eth, "ether"));
	var account = accounts[2];

	let deposit = await batch.batchDeposit([data.pubkeys[0]], [data.credentials[0]], [data.signatures[0]], [data.data_roots[0]], {
	    'value': amount_wei,
	    'from': account
	});

	truffleAssert.eventEmitted(deposit, 'LogDepositSent', (ev) => {
	    return ev.pubkey === data.pubkeys[0] && ev.withdrawal == data.credentials[0];
	}, "Should have processed the first deposit");

	truffleAssert.eventEmitted(deposit, 'LogDepositLeftover', (ev) => {
	    return ev.to == account && ev.amount.toString() == '8000000000000000000';
	});
    });

});
