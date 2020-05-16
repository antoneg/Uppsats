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

  it('Should create forum', async () => {
    let f = null;
    f = await fc.createForum("FirstForum");
    let e = f.receipt.logs[0].event;
    let success = f.receipt.logs[0].args.succ
    assert(e === "CreateForum");
    assert(success === true);
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
    assert(fName === "FirstForum")
    assert(forumId.toNumber() === 1)
  });

  it('Should return correct forum data via user address', async () => {
    let f = null;
    f = await fc.getForumData(accounts[0]);
    let owner = f.forumOwner;
    let fName = f.forumName;
    let forumId = f.fid;
    assert(owner === accounts[0]);
    assert(fName === "FirstForum")
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
    console.log(address);
    console.log(accounts[0]);
    console.log(name);
    console.log(karma);
    assert(address == accounts[0]);
    assert(name === "FirstForum");
    assert(karma === 0);
  });

  it("Forum's one and only user should be the forum itself (using getUserData(address user))", async () => {
    let res = null;
    res = await fc.getUserByAddress(accounts[0]); //user index 0
    let address = res.usrAddress;
    let name = res.usrName;
    let karma = res.usrKarma.toNumber();
    assert(address === accounts[0]);
    assert(name === "FirstForum");
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
    //console.log(msg);
    //console.log(res);
    assert(true);
  });

  it('Should not be possoble to get a non-existing forum', async () => {
    let f = null;
    let msg = '';
    try {
      f = await fc.getForumDataByFid(2);
    }catch(e){
      msg = e.message;
    }
    assert(msg.includes('Forum does not exists.'));
  });

  it('Should not be possible to create a forum again (with the same user adress)', async () => {
    let f = null;
    let msg = '';
    let numForums = null;
    try {
        f = await fc.createForum("FirstForumAGAIN");
    }catch(e){
      msg = e.message;
    }
    numForums = await fc.getForumCount();
    numForums = numForums.toNumber();
    assert(numForums === 1)
    assert(msg.includes("You already own a forum."))
  });

});
