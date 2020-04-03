
var Web3 = require('web3');
var web3 = new Web3('HTTP://127.0.0.1:8545');

var savJson = require('../build/contracts/SaviourCoin.json');
var forumJson = require('../build/contracts/Forum.json');

var savAddress = "0x7dabfb876Ad110815522c43cFa6C3604F8009c6a";//contractJson.networks[1585781614091].address; // Denna måste hårdkodas in
var forumAddress = "0x1050045a73C252cb652518FDAE0b8BB407aD27A9";

var savContract = new web3.eth.Contract(savJson.abi, savAddress);
var forumContract =  new web3.eth.Contract(forumJson.abi, forumAddress);

var accounts;

async function setUp(){
	await getAccs();
	console.log(accounts[0]);
	var from = accounts[0];
	var to = accounts[1];
	//await HelloExjobb();
	await transfer(from, to);
	await checkBal(from);
  await addUserToForum(to, "A", 10, from);
	await getMembers(to);
}

async function getAccs(){
 		accounts = await web3.eth.getAccounts(
		(err, result) => {if(err) {console.log("Failed to load accounts.")};});
}

async function transfer(from, to){
	await	savContract.methods.transfer(to, 10).send({from: from})
	.once('receipt', (receipt) => {console.log("Transaction successfull!")});
}

async function checkBal(acc){
	await savContract.methods.balanceOf(acc).call(
	(err, result) => {console.log(result)});
}


async function addUserToForum(address, username, karma, from){
	await	forumContract.methods.addUserToForum(address, username, karma).send({from: from})
	.once('receipt', (receipt) => {console.log("Added user: " + receipt.events.AddUserToForum.returnValues._success)});
}

async function getMembers(address){
	await forumContract.methods.getUserData(address).call(
	(err, result) => {console.log("UserAddress: " + result._address + '\n' +
																"UserName: " + result._userinfo + '\n' +
															  "Karma: " + result._karma)});
}


setUp();
