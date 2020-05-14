const SaviourCoin = artifacts.require("SaviourCoin");

module.exports = function(deployer) {
  deployer.deploy(SaviourCoin, 10000, "SaviourCoin", 0, "SavC");
};
