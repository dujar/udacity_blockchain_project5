let HDWalletProvider = require("truffle-hdwallet-provider");
let mnemonic = "gate tongue speed ghost melt regret adapt solution lottery boss boil hockey"
let accountForTestNetFaucer = "0x9fb2d9e0ae327439785a58f184929805c9643adc"
let notary = "0x58f1d5121e5ce2120de259fdc579808fbdea5ae2"
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
  },
    rinkeby: {
      provider: function(){
        return new HDWalletProvider(mnemonic,'https://rinkeby.infura.io/v3/38c30c6c70884366b9fb7f3747e72666')
      },
      // host: "localhost", //local node
      // port: 8545, // connection port
      network_id: 4, // network id for test networks
      gas: 5700000,//4700000, // gas limit
      gasPrice: 10000000000,
    }
  }
};