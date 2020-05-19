const Forum = artifacts.require('Forum');

contract('Forum', accounts => {
  let fc = null;
  before(async () => {
    fc = await Forum.deployed();
  });

/*  it('This test is just to show cash-out price after cash-outs. It will not always be the same', async () => {
    let res = null;
    await fc.createForum("FX");
    for (let i = 1; i<10; i++){
      await fc.addUserToForum(accounts[i], i.toString(), getRandomInt(100));
    }
    for (let i = 1; i<10; i++){
      res = await fc.getCashOutPrice(accounts[0]);
      console.log(res.toNumber());
      await fc.cashOut(accounts[0], {from: accounts[i]});
    }
    assert(true);
  });

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  */
});
