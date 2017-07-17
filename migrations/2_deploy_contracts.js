var PredictionChecker = artifacts.require("./PredictionChecker.sol");

module.exports = function(deployer) {
  deployer.deploy(PredictionChecker);
};
