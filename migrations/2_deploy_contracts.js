var PredictionChecker = artifacts.require("./PredictionChecker.sol");

module.exports = function(deployer) {
  deployer.deploy(PredictionChecker, [1, 0, 0, 1, 1, 0]);
};
