const SaviourCoin = artifacts.require("SaviourCoin");

module.exports = function(deployer) {
  deployer.deploy(SaviourCoin);
};
