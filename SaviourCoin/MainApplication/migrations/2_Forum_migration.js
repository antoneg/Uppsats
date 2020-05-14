const Forum = artifacts.require("Forum");

module.exports = function(deployer) {
  deployer.deploy(Forum, 10000, "Scone", 0, "SCN");
};
