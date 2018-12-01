let Migrations = artifacts.require("./Migrations.sol");
let Notary = artifacts.require("./StarNotary.sol")

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  // deployer.deployt(Notary)
};