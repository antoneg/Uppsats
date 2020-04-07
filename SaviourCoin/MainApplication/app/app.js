
var Web3 = require('web3');
var web3 = new Web3('HTTP://127.0.0.1:7545');

var savJson = require('../build/contracts/SaviourCoin.json');
var forumJson = require('../build/contracts/Forum.json');

var savAddress = "0x8158AEEbEd41940ee46080daE9946804C11f9e01";//contractJson.networks[1585781614091].address; // Denna måste hårdkodas in
var forumAddress = "0x7a16873b85C63c360de636216Aa266D8E57e9E7A";

var savContract = new web3.eth.Contract(savJson.abi, savAddress);
var forumContract =  new web3.eth.Contract(forumJson.abi, forumAddress);

var accounts;

async function setUp(){
	await getAccs();
	console.log(accounts[0]);
	var from = accounts[0];
	var to = accounts[1];
	var nobody = accounts[2];
	//await HelloExjobb();
//	await transfer(from, to);
//	await checkBal(from);
//  await addUserToForum(to, "A", 10, from);
//	await getMembers(to);
	await createForum("GenesisForum", from);
	await getForumData(0);
	await addUserToForum(to, "A", 10, from);
	await getMembers(nobody);
}

async function getAccs(){
 		accounts = await web3.eth.getAccounts(
		(err, result) => {if(err) {console.log("Failed to load accounts.")};});
}

async function transfer(from, to){
	await	savContract.methods.transfer(to, 10).send({from: from})
	.once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
}

async function checkBal(acc){
	await savContract.methods.balanceOf(acc).call(
	(err, result) => {console.log('\n' + result)});
}

async function addUserToForum(address, username, karma, from){
	await	forumContract.methods.addUserToForum(address, username, karma).send({from: from})
	.once('receipt', (receipt) => {console.log('\n' + "Added user: " + receipt.events.AddUserToForum.returnValues._success)});
}

async function getMembers(address){
	await forumContract.methods.getUserData(address).call(//{from: accounts[1]},
	(err, result) => {console.log('\n' + "Memberdata {" + '\n' + "UserAddress: " + result._address + '\n' +
																"UserName: " + result._userinfo + '\n' +
															  "Karma: " + result._karma + '\n' + "}")});
}

async function createForum(fName, from){
	await	forumContract.methods.createForum(fName).send({from: from, gas: 6721975 })
	.once('receipt', (receipt) => {console.log('\n' + "Forum created. ")});
}

async function getForumData(fid){
	await forumContract.methods.getForumData(fid).call(
	(err, result) => {console.log('\n' + result.Owner)});
}

setUp();
