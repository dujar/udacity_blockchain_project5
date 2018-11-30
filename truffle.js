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
      host: "localhost", //local node
      port: 8545, // connection port
      network_id: 4, // network id for test networks
      gas: 4700000 // gas limit
    }
  }
};