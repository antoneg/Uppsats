
var Web3 = require('web3');
var web3 = new Web3('HTTP://127.0.0.1:8545');

var contractJson = require('../build/contracts/SaviourCoin.json');

var contractAddress = contractJson.networks[1585140692481].address;
var contract = new web3.eth.Contract(contractJson.abi, contractAddress);

contract.methods.helloWorld().call(
	(err, result) => {console.log(result)});
/*
var accounts = null;
async function accs(){
	var as = await web3.eth.getAccounts()
	console.log(as[0]);
	accounts = as;
}
*/
var accounts = null;
var x = web3.eth.getAccounts(
	(err, result) => {accounts = result}
										         );

console.log(accounts);
var acc1 = "0x70F750b37cC8df2D3a95e0A3E76A23B45F8099ce";
var acc2 = "0xbe9F16bE21652E4f1878834cD89488801e2c98FA";

contract.methods.transfer(acc2, 10).send({from: acc1})
.once('receipt', (receipt) => {console.log("Yes")});

contract.methods.balanceOf(acc1).call(
	(err, result) => {console.log(result)});
