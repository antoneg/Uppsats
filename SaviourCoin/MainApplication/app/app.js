var Web3 = require('web3');
var web3 = new Web3('HTTP://127.0.0.1:7545');

var contractJson = require('../build/contracts/SaviourCoin.json');

var contractAddress = "0x56e1D54506Ba7d0dd36c22059e4ACabcF4f3B291";
var contract = new web3.eth.Contract(contractJson.abi, contractAddress);

contract.methods.helloWorld().call(
	(err, result) => {console.log(result)});

var acc1 = "0x1D725392C358b5Be4E9944D8C6a8d716a7128434";
var acc2 = "0xB83E4c4c35698b18CAdeF7Bec22CCDc83CaBEa85";

contract.methods.transfer(acc2, 10).send({from: acc1})
.once('receipt', (receipt) => {console.log("Yes")});

contract.methods.balanceOf(acc1).call(
	(err, result) => {console.log(result)});

