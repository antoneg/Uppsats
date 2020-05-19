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

  it('User 0 should create forum, F1', async () => {
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

  it('User 0 should NOT be able to create a forum again', async () => {
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

  it('Should return correct forum data via fid', async () => {
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

  it('Only one user should be registered in F1', async () => {
    let uCount = null;
    uCount = await fc.getUserCount();
    assert(uCount.toNumber() === 1);
  });

  it("Only user 0 should be registered in F1 (using getUserByIndex(uint256 x))", async () => {
    let res = null;
    res = await fc.getUserByIndex(0); //user index 0
    let address = res.usrAddress;
    let name = res.usrName;
    let karma = res.usrKarma.toNumber();
    assert(address == accounts[0]);
    assert(name === "F1");
    assert(karma === 0);
  });

  it("Only user 0 should be registered in F1 (using getUserData(address user))", async () => {
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
    assert(msg.includes('This user does not exist.'));
  });

  it('Should not be possoble to get a non-existing user (using getUserByAddress(address a))', async () => {
    let res = null;
    let msg = '';
    try {
      res = await fc.getUserByAddress(accounts[1]);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('This user does not exist.'));
  });


  it('Using the contract methods, user 1 should not be able to get user data without having a forum (using getUserByIndex(uint256 x))', async () => {
    let res = null;
    let msg = '';
    try {
      res = await fc.getUserByIndex(0, {from: accounts[1]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You need to create a forum first'));
  });

  it('Using the contract methods, user 1 should not be able to get user data without having a forum  (using getUserByAddress(address a))', async () => {
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
    assert(msg.includes('Forum does not exist.'));
  });

  it('User 0 should be able to add user 1 to F1', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[1], "1", 10);
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[1]);
    assert(userName === "1");
    assert(karma === 10)
  });

  it('Should not be possible to add user 1 again', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.addUserToForum(accounts[1], "1", 10);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes("User already exists."));
  });

  it('A user with no forum ownership should not be able to add users', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.addUserToForum(accounts[3], "AAA", 10, {from: accounts[1]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes("You need to create a forum first"));
  });

  let karmaArray = [0,10,13,3,43,26,7,12];
  it('User 0 should add users 2..7 to forum F1', async () => {
    let res = null;
    let kChecker = 0;
    let uNameChecker = 0;
    let addressChecker = 0;
    for (let i = 2; i<8; i++){
      let k = karmaArray[i];
      res = await fc.addUserToForum(accounts[i], i.toString(), k);
      let args = res.receipt.logs[0].args;
      if(args._karma.toNumber() == karmaArray[i])
        kChecker ++;
      if(args._userName == i.toString())
        uNameChecker ++;
      if(args._userAddress == accounts[i])
        addressChecker ++;
    }
    assert(kChecker === 6);
    assert(uNameChecker === 6);
    assert(addressChecker === 6);
  });


  it('Users 1..7 should be able to fetch its data from forum F1 via forum address', async () => {
    let res = null;
    let fidChecker = 0;
    let forumAddressChecker = 0;
    let addressChecker = 0;
    let uNameChecker = 0;
    let karmaChecker = 0;
    for (let i = 1; i<8; i++){
      res = await fc.getMyInfo(accounts[0], {from: accounts[i]});
      if(res._fID.toNumber() === 1)
        fidChecker ++;
      if(res._forumAddress === accounts[0])
        forumAddressChecker++;
      if(accounts[i] === res._myAddress)
        addressChecker ++;
      if(res._userName === i.toString())
        uNameChecker ++;
      if(res._karma.toNumber() === karmaArray[i])
        karmaChecker ++;
    }
    assert(fidChecker === 7);
    assert(addressChecker === 7);
    assert(forumAddressChecker === 7);
    assert(uNameChecker === 7);
    assert(karmaChecker === 7);
  });

  it('Users 1..7 should be able to fetch its data from forum F1 via fid', async () => {
    let res = null;
    let fidChecker = 0;
    let forumAddressChecker = 0;
    let addressChecker = 0;
    let uNameChecker = 0;
    let karmaChecker = 0;
    for (let i = 2; i<8; i++){
      res = await fc.getMyInfoByFid(1, {from: accounts[i]});
      if(res._fID.toNumber() === 1)
        fidChecker ++;
      if(res._forumAddress === accounts[0])
        forumAddressChecker++;
      if(accounts[i] === res._myAddress)
        addressChecker ++;
      if(res._userName === i.toString())
        uNameChecker ++;
      if(res._karma.toNumber() === karmaArray[i])
        karmaChecker ++;
    }
    assert(fidChecker === 6);
    assert(addressChecker === 6);
    assert(forumAddressChecker === 6);
    assert(uNameChecker === 6);
    assert(karmaChecker === 6);
  });

  it('User 0 should be able to get user data from ALL its users (via user addresses)', async () => {
    let res = null;
    let addressChecker = 0;
    let uNameChecker = 0;
    let karmaChecker = 0;
    for (let i = 1; i<8; i++){
      res = await fc.getUserByAddress(accounts[i]);
      if(accounts[i] === res.usrAddress)
        addressChecker ++;
      if(res.usrName === i.toString())
        uNameChecker ++;
      if(res.usrKarma.toNumber() === karmaArray[i])
        karmaChecker ++;
    }
    assert(addressChecker === 7);
    assert(uNameChecker === 7);
    assert(karmaChecker === 7);
  });

  it('User 0 should be able to get user data from ALL its users (via user indexes)', async () => {
    let res = null;
    let addressChecker = 0;
    let uNameChecker = 0;
    let karmaChecker = 0;
    for (let i = 1; i<8; i++){
      res = await fc.getUserByIndex(i);
      if(accounts[i] === res.usrAddress)
        addressChecker ++;
      if(res.usrName === i.toString())
        uNameChecker ++;
      if(res.usrKarma.toNumber() === karmaArray[i])
        karmaChecker ++;
    }
    assert(addressChecker === 7);
    assert(uNameChecker === 7);
    assert(karmaChecker === 7);
  });


  // tot acc karma F1 = 10+13+3+43+26+7+12 = 114
  it('User 1 should create forum, F2 ', async () => {
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

  it('User 1 should be able to add user 3 to F2', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[2], "3", 13, {from: accounts[1]});
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[2]);
    assert(userName === "3");
    assert(karma === 13);
  });

  it('Should be possible to add user 8 to F2', async () => {
    let res = null;
    res = await fc.addUserToForum(accounts[8], "8", 4, {from: accounts[1]});
    let args = res.receipt.logs[0].args;
    let userAddress = args._userAddress;
    let userName = args._userName;
    let karma = args._karma.toNumber();
    assert(userAddress === accounts[8]);
    assert(userName === "8");
    assert(karma === 4);
  });
// tot karma f2 = 4 + 13 = 17
  it('User 8 should not exist in F1', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.getUserByAddress(accounts[8]);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes("This user does not exist."))
  });

  it('Acting as user 3, one should get user data from F1 (using getMyInfoByFid(uint256 x))', async () => {
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

  it('Acting as user 3, one should get user data from F1 (using getMyInfo(address a))', async () => {
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

  it('Acting as user 8, one should get user data from F2 (using getMyInfoByFid(uint256 x))', async () => {
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

  it('Acting as user 8, one should get user data from F2 (using getMyInfo(address a))', async () => {
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

  it('Acting as user 8, one should NOT get user data from F1 (using getMyInfoByFid(uint256 x))', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.getMyInfoByFid(0, {from: accounts[8]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You are not a member in this forum.'));
  });

  it('Acting as user 8, one should NOT get user data from F1 (using getMyInfo(address a))', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.getMyInfo(accounts[0], {from: accounts[8]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You are not a member in this forum.'));
  });

  it('Acting as user 8, one should be able to see it is a member in F2', async () => {
    let res = null;
    res = await fc.getMemberStatus(2, {from: accounts[8]});
    assert(res === true);
  });

  it('Acting as user 8, one should be able to see it is NOT a member in F1', async () => {
    let res = null;
    res = await fc.getMemberStatus(1, {from: accounts[8]});
    assert(res === false);
  });

  it('Should be able to calculate an accumulated karma sum', async () => {
    let res = null;
    res = await fc.accForumKarma(accounts[0]);
    assert(res.toNumber() === 114);
  });

  it('User 0 should not be able to cash out from F3 since F3 does not exist', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.cashOut(accounts[2]);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('Forum does not exist'));

  });

  it('User 8 should not be able to cash out from F2 since cash-out price is 0', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.cashOut(accounts[1], {from: accounts[8]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('Cash-out price is 0 scones.'));
  });
//This test
// max is 87
  it("User 0 should not be able to set COP to a value that the user's balance can't handle.", async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.setCashOutPrice(88);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('To high. Aquire more scones or try a lower COP.'));
  });

  it("User 0 should be able to set COP to a value that the user's balance can handle.", async () => {
    let fd = null;
    fd = await fc.getForumDataByFid(1);
    let fcopBefore = fd.cop.toNumber();
    await fc.setCashOutPrice(10);
    fd = await fc.getForumDataByFid(1);
    let fcopAfter = fd.cop.toNumber();
    assert(fcopBefore === 0);
    assert(fcopAfter === 10);
  });

  it("User 9 should not be able to cash out from F1 since 9 is not a member in F1.", async () => {
    let res = null;
    let msg = '';
    try{
      await fc.cashOut(accounts[0], {from: accounts[9]});
    }catch(e){
      msg = e.message;
    }
    assert('You are not a member in this forum.')
  });

  it("User 0 should not be able to set user 9's karma since 9 is not a member in F1.", async () => {
    let res = null;
    let msg = '';
    try{
      await fc.setKarma(10, accounts[9]);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('This user does not exist in your forum.'))
  });

  it("User 9 can not set a user's karma since 9 does not own a forum.", async () => {
    let res = null;
    let msg = '';
    try{
      await fc.setKarma(10, accounts[4], {from: accounts[9]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You need to create a forum first.'))
  });

  it("User 0 can not add user 9 to F1 if user 9's karma is set to high", async () => {
    let res = null;
    let msg = '';
    try{
      // to high if set to 887, (works if 886)
      res = await fc.addUserToForum(accounts[9], "9", 887)
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('User is given too much karma. Your balace might not be able to handle it.'))
  });

  it("User 0 can add user 9 to F1 if user 9's karma is not set to high. (It is set to 0).", async () => {
    let res = null;
    await fc.addUserToForum(accounts[9], "9", 0);
    res = await fc.getUserByAddress(accounts[9]);
    let n = res.usrName;
    let k = res.usrKarma.toNumber();
    let a =res.usrAddress;
    assert(n === "9");
    assert(a === accounts[9]);
    assert(k === 0);
  });

  it("User 0 can not change user 9's karma to a value that is to high", async () => {
    let res = null;
    let msg = '';
    try{
      await fc.setKarma(887, accounts[9]);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('User is given too much karma. Your balace might not be able to handle it.'))
  });

  it("User 9 should not be able to cash out from F1 since 9's karma is 0.", async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.cashOut(accounts[0], {from: accounts[9]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You need karma to cash out.'));
  });

//this would be 886
  it("User 0 should be able to set 9's karma in F1 to a value that is as high as possible.", async () => {
    let res = null;
    await fc.setKarma(886, accounts[9]);
    res = await fc.getUserByIndex(8); // Has index 8. 9 is 8th member in F1, and second in F2. Sry for confusion.
    let k = res.usrKarma.toNumber();
    let a = res.usrAddress;
    let n = res.usrName;
    assert(k === 886);
    assert(a === accounts[9]);
    assert(n === "9");
  });

  it('User 1 should be able to cash out from F1', async () => {
    let res = null;
    res = await fc.cashOut(accounts[0], {from: accounts[1]});
    let cop = res.logs[0].args._cop.toNumber();
    let karma = res.logs[0].args._karma.toNumber();
    let forum = res.logs[0].args._from;
    let to = res.logs[0].args._to;
    assert(cop === 10);
    assert(karma === 10);
    assert(forum === accounts[0]);
    assert(to === accounts[1]);
  });

  var bal1 = 0;
  it('Balance of F2 (or user 1) should be equal to what user 1 got from cash out.', async () => {
    bal1 = await fc.balanceOf(accounts[1]);
    bal1 = bal1.toNumber();
    assert(bal1 === 10 * karmaArray[1]);

  });

  it('Balance of F1 (or user 0) should be 10 000 - balanceOf(user 1)', async () => {
    let res = null;
    res = await fc.balanceOf(accounts[0]);
    assert(res.toNumber() === 10000-bal1);
  });

  it('Acting as user 1, one shold no longer be able to cash out scones from F1 (because karma becomes set to 0 when cash out)', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.cashOut(accounts[0], {from: accounts[1]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You need karma to cash out.'));
  });

//4+13 = 17
  it('Given that F2 has a set COP, user 8 shold be able to cash out from F2', async () => {
    await fc.setCashOutPrice(1, {from: accounts[1]});
    let ud = null;
    let res = null;
    res = await fc.cashOut(accounts[1], {from: accounts[8]});
    let cop = res.logs[0].args._cop.toNumber();
    let karma = res.logs[0].args._karma.toNumber();
    let forum = res.logs[0].args._from;
    let to = res.logs[0].args._to;
    assert(karma === 4);
    assert(cop === 1)
    assert(forum === accounts[1]);
    assert(to === accounts[8]);
  });


  it('Acting as user 8, one shold NOT be able to cash out from F1 since user 8 is not a member in F1', async () => {
    let res = null;
    let msg = '';
    try{
      res = await fc.cashOut(accounts[0], {from: accounts[8]});
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('You are not a member in this forum.'));
  });

  it('The rest of all users in F1 (except 0) should be able to cash out', async () => {
    let ud = null;
    let bal = null;
    let cop = 0;
    let errors = 0;
    let check = 0;
    for (var i = 2; i < 8 ; i++) {
      try{
        ud = await fc.getUserByIndex(i);
        cop = await fc.getCashOutPrice(accounts[0]);
        res = await fc.cashOut(accounts[0], {from: accounts[i]});
        bal = await fc.balanceOf(accounts[i]);
        if(bal.toNumber() === cop.toNumber() * ud.usrKarma.toNumber())
          check ++;
      }catch(e){
        errors ++;
      }
    }
    // and user 9...
    try{
      ud = await fc.getUserByIndex(8);
      cop = await fc.getCashOutPrice(accounts[0]);
      res = await fc.cashOut(accounts[0], {from: accounts[9]});
      bal = await fc.balanceOf(accounts[9]);
      if(bal.toNumber() === cop.toNumber() * ud.usrKarma.toNumber())
        check ++;
    }catch(e){
      errors ++;
    }
    assert(check === 7)
    assert(errors === 0)
  });

  it('Balance of F1 (or user 0) should be 0', async () => {
    let res = null;
    res = await fc.balanceOf(accounts[0]);
    assert(res.toNumber() === 0)
  });
// tot acc karma F1 = 0+10+13+3+43+26+7+12 = 114
});
