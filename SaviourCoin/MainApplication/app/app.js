var Web3 = require('web3');
var web3 = new Web3('HTTP://127.0.0.1:7545');

var contractJson = require('../build/contracts/SaviourCoin.json');

var contractAddress = "0xcF4Cb7388577714Af530e2Ee261Ba0eB44558698";
var contract = new web3.eth.Contract(contractJson.abi, contractAddress);

contract.methods.myFunction().call(
	(err, result) => {console.log(result)});

var acc1 = "0xb20D6C68775Aae022e0770f651a4Af3624Ad679c";
var acc2 = "0x542A0f8c4F4DD6Cf4c4A6fD844ee5077413C2c48";

contract.methods.transfer(acc2, 10).send({from: acc1})
.once('receipt', (receipt) => {console.log("Yes")});

contract.methods.balanceOf(acc1).call(
	(err, result) => {console.log(result)});

