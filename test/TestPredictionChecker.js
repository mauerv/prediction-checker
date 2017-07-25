const increaseTime = require('zeppelin-solidity/test/helpers/increaseTime.js');
const PredictionChecker = artifacts.require('PredictionChecker');
const testUtils = require('../utils/test-helpers.js');

contract('PredictionChecker', function(accounts) {

    it("shouldn't change winningAddress or highest score if prediction accuracy is 0.", function() {
        let checker;

        return PredictionChecker.new([1, 1, 1, 0, 0, 0]).then(function(instance) {
            checker = instance;
            return checker.submitPredictions([0, 0, 0, 1, 1, 1], {from: web3.eth.accounts[0]});
        }).then(function() {
            return checker.winningAddress.call();
        }).then(function(res) {
            assert(res == 0, "It shouldn't award prize to accuracy of 0.");
            return checker.highestScore.call();
        }).then(function(res) {
            assert(res == 0, "The highest score should still be 0 after accuracy of 0.");
        });
    });

    it("shouldn't change winningAddress or highest score for equal or worse submission.", function() {
        let checker,
            firstHighScore;

        return PredictionChecker.new([1, 1, 1, 0, 0, 0]).then(function(instance) {
            checker = instance;
            return checker.submitPredictions([1, 1, 1, 1, 1, 1], {from: web3.eth.accounts[0]});
        }).then(function() {
            return checker.winningAddress.call();
        }).then(function(res) {
            assert(res != 0, "It should update winning address after positive prediction.");
            return checker.highestScore.call();
        }).then(function(res) {
            firstHighScore = Number(res);
            assert(firstHighScore != 0, "The highest score should update after positive prediction.");
            return checker.submitPredictions([1, 1, 0, 1, 1, 1], {from: web3.eth.accounts[1]});
        }).then(function() {
            return checker.winningAddress.call();
        }).then(function(res) {
            assert(res == web3.eth.accounts[0], "A worse accuracy shouldn't change the winning address.");
            return checker.highestScore.call();
        }).then(function(res) {
            assert(Number(res) == firstHighScore, "A worse accuracy shouldn't change the highest score.");
        }).then(function(res) {
            return checker.submitPredictions([1, 1, 1, 1, 1, 1], {from: web3.eth.accounts[1]});
        }).then(function() {
            return checker.winningAddress.call();
        }).then(function(res) {
            assert(res == web3.eth.accounts[0], "A tie to the highest accuracy shouldn't change the winning address.");
            return checker.highestScore.call();
        }).then(function(res) {
            assert(res == firstHighScore, "A tie to the highest accuracy shouldn't change the highest score.");
        });
    });

    it("should compute accuracy correctly", function() {
        let checker;
        return PredictionChecker.new([1, 1, 1, 0, 0, 0]).then(function(instance) {
            checker = instance;
            return checker.submitPredictions([1, 1, 1, 1, 1, 1], {from: web3.eth.accounts[0]});
        }).then(function(res) {
            testUtils.assertLogs(res.logs, 'LogPrediction', 'accuracy', 50, 'The returned accuracy should be 50');
            return checker.submitPredictions([1, 1, 0, 1, 1, 1], {from: web3.eth.accounts[0]});
        }).then(function(res) {
            testUtils.assertLogs(res.logs, 'LogPrediction', 'accuracy', 33, 'The returned accuracy should be 33');
            return checker.submitPredictions([1, 1, 1, 0, 0, 0], {from: web3.eth.accounts[0]});
        }).then(function(res) {
            testUtils.assertLogs(res.logs, 'LogPrediction', 'accuracy', 100, 'The returned accuracy should be 100');
            return checker.submitPredictions([0, 0, 0, 1, 1, 1], {from: web3.eth.accounts[0]});
        }).then(function(res) {
            testUtils.assertLogs(res.logs, 'LogPrediction', 'accuracy', 0, 'The returned accuracy should be 0');
        });
    });

    // Testing fallback function
    it("should stop accepting ether once the grant is finished.", function() {
        /*
        let checker;
        return PredictionChecker.new([1, 1, 1, 0, 0, 0]).then(function(instance) {
        }).then(function(res) {

        });
        */
        console.log(time());
    });

    // Testing prize claim functionality.
    it("should only award prize to the winning address.", function() {

    });

    it("should only pay up after the prediction acceptance time is over.", function() {

    });
});
