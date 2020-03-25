var Web3 = require('web3');
var web3 = new Web3('HTTP://127.0.0.1:7545');

var contractJson = require('../build/contracts/SaviourCoin.json');

var contractAddress = "0xcF4Cb7388577714Af530e2Ee261Ba0eB44558698";
var contract = new web3.eth.Contract(contractJson.abi, contractAddress);

contract.methods.myFunction().call(
	(err, result) => {console.log(result)});
//console.log(abi);
//async loadChain(){
//  var Web3 = require('web3');
//  var web3 = new Web3(Web3.givenProvider);
//  var contract = new web3.eth.Contract(SavC.abi, "0x890af5f7C3b2863e1E2e53Cd2cBC748F4846FdBa");
//  let i = await contract.deployed();
//}
var acc1 = "0xb20D6C68775Aae022e0770f651a4Af3624Ad679c";
var acc2 = "0x542A0f8c4F4DD6Cf4c4A6fD844ee5077413C2c48";

contract.methods.transfer(acc1, 10).send({from: acc2});

contract.methods.balanceOf(acc2).call(
	(err, result) => {console.log(result)});


//await loadChain();
/*'use strict';

global.artifacts = artifacts;
global.web3 = web3;

async function main(){
    const newtworkType = await web3.eth.net.getNetworkType();
    const networkId = await web3.eth.net.getId();
    console.log("network type:"+newtworkType);
    console.log("network id:"+networkId);
    
    var contract = new web3.eth.Contract(SavC.abi, SavC.abi.address);
	//contract.options.addess = "0x890af5f7C3b2863e1E2e53Cd2cBC748F4846FdBa";
    //console.log(contract.options.addess);
	//var Instance = contract.At("address");

    //var contract = new web3.eth.Contract(SavC.abi, "0x890af5f7C3b2863e1E2e53Cd2cBC748F4846FdBa");
    console.log(SavC.abi.address);
    
    //await contract.methods.myFunction().call()
    //.then(console.log);
}


// For truffle exec
module.exports = function(callback) {
    main().then(() => callback()).catch(err => callback(err))
};
*/
