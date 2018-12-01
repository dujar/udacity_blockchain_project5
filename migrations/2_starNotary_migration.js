let Notary = artifacts.require("./StarNotary.sol")

module.exports = function(deployer) {
//  deployer.deploy(Migrations);
   deployer.deploy(Notary)
};