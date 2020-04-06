var Web3 = require('web3');
const ganache = require("ganache-core");
const web3 = new Web3(ganache.provider());

var x = ganache.accounts.1;
console.log(x);
