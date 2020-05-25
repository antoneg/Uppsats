
var Web3 = require('web3');
var web3 = new Web3('HTTP://127.0.0.1:7545');

var forumJson = require('../build/contracts/Forum.json');
//contractJson.networks[1585781614091].address; // Denna måste hårdkodas in
var forumAddress = "0x8158AEEbEd41940ee46080daE9946804C11f9e01";

var forumContract =  new web3.eth.Contract(forumJson.abi, forumAddress);

var accounts;

async function setUp(){
	await getAccs();
//	console.log(accounts[0]);
	var from = accounts[0];
	var to = accounts[1];
	var nobody = accounts[2];
  //await HelloExjobb();
//	await transfer(from, to);
	await checkBal(from);
//		await forumBalOf(to);
		//await forumBalOf(to);


//	await createForum("GenesisForum", from);
//  await getMembers(to);
//	await getForumData(1);
//	await addUserToForum(to, "First guest", 10, from);
//  await getMembers(from);
}

async function getAccs(){
 		accounts = await web3.eth.getAccounts(
		(err, result) => {if(err) {console.log("Failed to load accounts.")};});
}

async function transfer(from, to){
	await	forumContract.methods.transfer(to, 10).send({from: from})
	.once('receipt', (receipt) => {console.log('\n' + "Transaction successfull!")});
}

async function checkBal(acc){
	await forumContract.methods.balanceOf(acc).call(
	(err, result) => {console.log('\n' + result)});
}

async function addUserToForum(address, username, karma, from){
	var ev;
	var res;
	var msg;
	await	forumContract.methods.addUserToForum(address, username, karma).send({from: from, gas: 6721975})
	.once('receipt', (receipt) => {ev = receipt.events.AddUserToForum, res = ev.returnValues.succ, msg = ev.returnValues.info, console.log(res + '\n' + msg)});
//	.once('receipt', (receipt) => {console.log(JSON.stringify(receipt));});
//, console.log(res), console.log(msg)
// res = ev.Result.succ, msg = ev.Result.info,
}

async function getMembers(address){
	await forumContract.methods.getUserData(address).call({gas: 6721975},
	(err, result) => {console.log('\n' + "Memberdata {" + '\n' + "UserAddress:returnValues " + result._address + '\n' +
																"UserName: " + result._userinfo + '\n' +
															  "Karma: " + result._karma + '\n' +
																"Result: " + result.succ + '\n' + "}")});
}

async function createForum(fName, from){
	await	forumContract.methods.createForum(fName).send({from: from, gas: 6721975 })
	.once('receipt', (receipt) => {console.log(receipt.events.CreateForum.returnValues.succ)});
}

async function getForumData(fid){
	await forumContract.methods.getForumData(fid).call(
	(err, result) => {console.log('\n' + result.succ + '\n' + result.Forum_Name) + '\n'});
}

}

setUp();
