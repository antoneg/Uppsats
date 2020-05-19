const Forum = artifacts.require('Forum');

contract('Forum', accounts => {
  let fc = null;
  before(async () => {
    fc = await Forum.deployed();
  });

  it('Should deploy contract', async () => {
    assert(fc.added != ''); // Contract address is not empty
  });

  it('Initial balance should be 10000', async () => {
    let b = null;
    b = await fc.balanceOf(accounts[0], {from: accounts[2]});
    assert(b.toNumber() === 10000);
  });

  it('Name of token should be "Scone"', async () => {
    let name = null;
    name = await fc.name();
    assert(name === "Scone");
  });

  it('Symbol of token should be "SCN"', async () => {
    let name = null;
    name = await fc.symbol();
    assert(name === "SCN");
  });

  it('Forum counter should be 0', async () => {
    let counter = null;
    counter = await fc.getForumCount();
    assert(counter.toNumber() === 0);
  });

  it('Should create forum, "F1"', async () => {
    let f = null;
    f = await fc.createForum("F1");
    let e = f.receipt.logs[0].event;
    let success = f.receipt.logs[0].args._success;
    let self = f.receipt.logs[0].args._forumAddress;
    let fname = f.receipt.logs[0].args._forumName;
    let fid = f.receipt.logs[0].args._fid;
    assert(e === "CreateForum");
    assert(success === true);
    assert(self === accounts[0]);
    assert(fname === "F1");
    assert(fid.toNumber() === 1);
  });

  it('Should not be possible to create a forum again (from the same user)', async () => {
    let f = null;
    let msg = '';
    let numForums = null;
    try {
        f = await fc.createForum("DoesNotMatter");
    }catch(e){
      msg = e.message;
    }
    numForums = await fc.getForumCount();
    numForums = numForums.toNumber();
    assert(numForums === 1)
    assert(msg.includes("You already own a forum."))
  });

  it('Forum counter should be 1', async () => {
    let counter = null;
    counter = await fc.getForumCount();
    assert(counter.toNumber() === 1);
  });

  it('Should return correct forum data via forumID', async () => {
    let f = null;
    f = await fc.getForumDataByFid(1);
    let owner = f.forumOwner;
    let fName = f.forumName;
    let forumId = f.fid;
    assert(owner === accounts[0]);
    assert(fName === "F1")
    assert(forumId.toNumber() === 1)
  });

  it('Should return correct forum data via forum address', async () => {
    let res = null;
    res = await fc.getForumData(accounts[0]);
    let owner = res.forumOwner;
    let fName = res.forumName;
    let forumId = res.fid;
    assert(owner === accounts[0]);
    assert(fName === "F1")
    assert(forumId.toNumber() === 1)
  });

  it('Forum should have one and only one user registered', async () => {
    let uCount = null;
    uCount = await fc.getUserCount();
    assert(uCount.toNumber() === 1);
  });

  it("Forum's one and only user should be the forum itself (using getUserByIndex(uint256 x))", async () => {
    let res = null;
    res = await fc.getUserByIndex(0); //user index 0
    let address = res.usrAddress;
    let name = res.usrName;
    let karma = res.usrKarma.toNumber();
    assert(address == accounts[0]);
    assert(name === "F1");
    assert(karma === 0);
  });

  it("Forum's one and only user should be the forum itself (using getUserData(address user))", async () => {
    let res = null;
    res = await fc.getUserByAddress(accounts[0]); //user index 0
    let address = res.usrAddress;
    let name = res.usrName;
    let karma = res.usrKarma.toNumber();
    assert(address === accounts[0]);
    assert(name === "F1");
    assert(karma === 0);
  });

  it('Should not be possoble to get a non-existing user (using getUserByIndex(uint256 x))', async () => {
    let res = null;
    let msg = '';
    try {
      res = await fc.getUserByIndex(1);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('This user does not exists.'));
  });

  it('Should not be possoble to get a non-existing user (using getUserByAddress(address a))', async () => {
    let res = null;
    let msg = '';
    try {
      res = await fc.getUserByAddress(accounts[1]);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('This user does not exists.'));
  });


  it('Should not be possoble to get user data without having a forum (using getUserByIndex(uint256 x))', async () => {
    let res = null;
    let msg = '';
    try {
      res = await fc.getUserByIndex(0, {from: accounts[1]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You need to create a forum first'));
  });

  it('Should not be possoble to get user data without having a forum (using getUserByAddress(address a))', async () => {
    let res = null;
    let msg = '';
    try {
      res = await fc.getUserByAddress(accounts[0], {from: accounts[1]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You need to create a forum first'));
  });

  it('Should not be possoble to get a non-existing forum', async () => {
    let res = null;
    let msg = '';
    try {
      res = await fc.getForumDataByFid(2);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('Forum does not exists.'));
  });

  it('Should be possible to add a user, "AAA", to a forum', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[1], "AAA", 10);
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[1]);
    assert(userName === "AAA");
    assert(karma === 10)
  });

  it('Should not be possible to add user "AAA" again', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.addUserToForum(accounts[1], "AAA", 10);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes("User already exists."));
  });

  it('Should not be possible to add user "AAA" to a non-existing forum', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.addUserToForum(accounts[3], "AAA", 10, {from: accounts[1]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes("You need to create a forum first"));
  });

  it('Should be possible to add a user, "BBB", to a forum', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[2], "BBB", 13);
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[2]);
    assert(userName === "BBB");
    assert(karma === 13);
  });

  it('Should be possible to add a user, "CCC", to a forum', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[3], "CCC", 3);
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[3]);
    assert(userName === "CCC");
    assert(karma === 3);
  });

  it('Should be possible to add a user, "DDD", to a forum', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[4], "DDD", 43);
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[4]);
    assert(userName === "DDD");
    assert(karma === 43);
  });

  it('Should be possible to add a user, "EEE", to a forum', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[5], "EEE", 26);
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[5]);
    assert(userName === "EEE");
    assert(karma === 26);
  });

  it('Should be possible to add a user, "FFF", to a forum', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[6], "FFF", 7);
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[6]);
    assert(userName === "FFF");
    assert(karma === 7);
  });

  it('Should be possible to add a user, "GGG", to a forum', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[7], "GGG", 12);
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[7]);
    assert(userName === "GGG");
    assert(karma === 12);
  });
  // tot acc karma F1 = 10+13+3+43+26+7+12 = 114
  it('Should create forum, "F2" (via another address than F1s)', async () => {
    let f = null;
    f = await fc.createForum("F2", {from: accounts[1]});
    let e = f.receipt.logs[0].event;
    let success = f.receipt.logs[0].args._success;
    let self = f.receipt.logs[0].args._forumAddress;
    let fname = f.receipt.logs[0].args._forumName;
    let fid = f.receipt.logs[0].args._fid;
    assert(true)
    assert(e === "CreateForum");
    assert(success === true);
    assert(self === accounts[1]);
    assert(fname === "F2");
    assert(fid.toNumber() === 2);
  });

  it('Should be possible to add user "BBB" to "F2"', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[2], "BBB", 13, {from: accounts[1]});
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[2]);
    assert(userName === "BBB");
    assert(karma === 13);
  });

  it('Should be possible to add user "HHH" to "F2"', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[8], "HHH", 4, {from: accounts[1]});
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[8]);
    assert(userName === "HHH");
    assert(karma === 4);
  });
// tot karma f2 = 4 + 13 = 17
  it('"HHH" should not exist in "F1"', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.getUserByAddress(accounts[8]);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes("This user does not exists."))
  });

  it('Acting as "BBB", one should get user data from F1 (using getMyInfoByFid(uint256 x))', async () => {
    let res = null;
    res = await fc.getMyInfoByFid(1, {from: accounts[2]});
    let fid = res._fID;
    let forumAddress = res._forumAddress;
    let myAddress = res._myAddress;
    let userName = res._userName;
    let karma = res._karma;
    assert(fid.toNumber() === 1);
    assert(forumAddress === accounts[0] );
    assert(myAddress === accounts[2]);
    assert(karma.toNumber() === 13);
  });

  it('Acting as "BBB", one should get user data from F1 (using getMyInfo(address a))', async () => {
    let res = null;
    res = await fc.getMyInfo(accounts[0], {from: accounts[2]});
    let fid = res._fID;
    let forumAddress = res._forumAddress;
    let myAddress = res._myAddress;
    let userName = res._userName;
    let karma = res._karma;
    assert(fid.toNumber() === 1);
    assert(forumAddress === accounts[0] );
    assert(myAddress === accounts[2]);
    assert(karma.toNumber() === 13);
  });

  it('Acting as "HHH", one should get user data from F2 (using getMyInfoByFid(uint256 x))', async () => {
    let res = null;
    res = await fc.getMyInfoByFid(2, {from: accounts[8]});
    let fid = res._fID;
    let forumAddress = res._forumAddress;
    let myAddress = res._myAddress;
    let userName = res._userName;
    let karma = res._karma;
    assert(fid.toNumber() === 2);
    assert(forumAddress === accounts[1] );
    assert(myAddress === accounts[8]);
    assert(karma.toNumber() === 4);
  });

  it('Acting as "HHH", one should get user data from F2 (using getMyInfo(address a))', async () => {
    let res = null;
    res = await fc.getMyInfo(accounts[1], {from: accounts[8]});
    let fid = res._fID;
    let forumAddress = res._forumAddress;
    let myAddress = res._myAddress;
    let userName = res._userName;
    let karma = res._karma;
    assert(fid.toNumber() === 2);
    assert(forumAddress === accounts[1] );
    assert(myAddress === accounts[8]);
    assert(karma.toNumber() === 4);
  });

  it('Acting as "HHH", one should NOT get user data from F1 (using getMyInfoByFid(uint256 x))', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.getMyInfoByFid(0, {from: accounts[8]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You are not a member in this forum.'));
  });

  it('Acting as "HHH", one should NOT get user data from F1 (using getMyInfo(address a))', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.getMyInfo(accounts[0], {from: accounts[8]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You are not a member in this forum.'));
  });

  it('Acting as "HHH", one should be able to see it is a member in F2', async () => {
    let res = null;
    res = await fc.getMemberStatus(2, {from: accounts[8]});
    assert(res === true);
  });

  it('Acting as "HHH", one should be able to see it is NOT a member in F1', async () => {
    let res = null;
    res = await fc.getMemberStatus(1, {from: accounts[8]});
    assert(res === false);
  });

  it('Should be able to calculate an accumulated karma sum', async () => {
    let res = null;
    res = await fc.accForumKarma(accounts[0]);
    assert(res.toNumber() === 114);
  });

  var copA = 0;
  it('Should be able to calculate a check-out price in F1', async () => {
    let res = null;
    let totB = 10000;
    let totK = 114;
    let rest = totB % totK;
    let cop = (totB-rest)/totK;
    res = await fc.getCashOutPrice(accounts[0]);
    copA = res.toNumber();
    console.log(copA);
    assert(res.toNumber() === cop);
  });

  it('Acting as HHH, one shold NOT be able to cash out from F2 since cash-out price is 0', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.cashOut(accounts[1], {from: accounts[8]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('Cash-out price is 0 scones.'));
  });

var balF2 = 0;
  it('Acting as AAA, one shold be able to cash out scones that is equal to current cash-out price in F1', async () => {
    let res = null;
    res = await fc.cashOut(accounts[0], {from: accounts[1]});
    let cop = res.logs[0].args._cop.toNumber();
    let karma = res.logs[0].args._karma.toNumber();
    let forum = res.logs[0].args._from;
    let to = res.logs[0].args._to;
    balF2 = cop*karma;
    assert(copA*10 === cop*karma); //870 scones
    assert(forum === accounts[0]);
    assert(to === accounts[1]);
  });

  it('Balance of F2 (AAA) should be equal to what AAA got from cash out.', async () => {
    let res = null;
    res = await fc.balanceOf(accounts[1]);
    //balF2 = res.toNumber();
    assert(res.toNumber() === balF2);
    balF2 = res.toNumber();
  });

  it('Balance of F1 should be 10 000 - balanceOf(AAA)', async () => {
    let res = null;
    res = await fc.balanceOf(accounts[0]);
    assert(res.toNumber() === 10000-balF2);
  });

//4+13 = 17
  it('Acting as HHH, one shold now be able to cash out from F2', async () => {
    let res = null;
    res = await fc.cashOut(accounts[1], {from: accounts[8]});
    let cop = res.logs[0].args._cop.toNumber();
    let karma = res.logs[0].args._karma.toNumber();
    let forum = res.logs[0].args._from;
    let to = res.logs[0].args._to;
    let priceF2 = cop;
    assert(51*4 === cop*karma); //870 SCN / 17 = 51,18 ...... 51*4 karma
    assert(forum === accounts[1]);
    assert(to === accounts[8]);
  });

  it('Acting as AAA, one shold no longer be able to cash out scones from F1 (because karam is set to 0)', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.cashOut(accounts[0], {from: accounts[1]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You need karma to cash out.'));
  });

  it('Acting as HHH, one shold NOT be able to cash out from F1 since HHH is not a member in F1', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.cashOut(accounts[0], {from: accounts[8]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You are not a member in this forum.'));
  });

  it('Acting as HHH, one shold NOT be able to cash out from F3 since F3 does not exist', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.cashOut(accounts[3], {from: accounts[8]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('Forum does not exist.'));
  });

  it('Acting as BBB, one shold be able to cash out from F1 with the same cash out price', async () => {
    let res = null;
    res = await fc.cashOut(accounts[0], {from: accounts[2]});
    let cop = res.logs[0].args._cop.toNumber();
    let karma = res.logs[0].args._karma.toNumber();
    let forum = res.logs[0].args._from;
    let to = res.logs[0].args._to;
    let priceF2 = cop;
    assert(copA === cop)
    assert(copA*13 === cop*karma);
    assert(forum === accounts[0]);
    assert(to === accounts[2]);
  });
// tot acc karma F1 = 0+10+13+3+43+26+7+12 = 114
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

});
