const Forum = artifacts.require('Forum');

contract('Forum', accounts => {
  let fc = null;
  before(async () => {
    fc = await Forum.deployed();
  });

  it('Should deploy contract', async () => {
    assert(fc.added != ''); // Contract address is not empty
  });

});
