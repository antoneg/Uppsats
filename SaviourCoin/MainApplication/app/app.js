
var Web3 = require('web3');
var web3 = new Web3('HTTP://127.0.0.1:8545');

var contractJson = require('../build/contracts/SaviourCoin.json');

var contractAddress = contractJson.networks[1585781614091].address; // Denna måste hårdkodas in
var contract = new web3.eth.Contract(contractJson.abi, contractAddress);

var accounts;

async function setUp(){
	await getAccs();
	console.log(accounts[0]);
	var from = accounts[0];
	var to = accounts[1];
	await HelloExjobb();
	await transfer(from, to);
	await checkBal(from);

}


async function HelloExjobb(){
	await contract.methods.helloWorld().call(
		(err, result) => {console.log(result)});
}

async function getAccs(){
 		accounts = await web3.eth.getAccounts(
		(err, result) => {if(err) {console.log("Failed to load accounts.")};});
}

async function transfer(from, to){
	await	contract.methods.transfer(to, 10).send({from: from})
	.once('receipt', (receipt) => {console.log("Yes")});
}

async function checkBal(acc){
	await contract.methods.balanceOf(acc).call(
	(err, result) => {console.log(result)});
}

setUp();
