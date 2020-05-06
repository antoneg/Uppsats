const Forum = artifacts.require("Forum");

module.exports = function(deployer) {
  deployer.deploy(Forum, 10000, "SaviourCoin", 0, "SavC");
};
