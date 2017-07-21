pragma solidity ^0.4.11;

import './StateMachine.sol';

contract PredictionChecker is StateMachine {
    // Private mapping holding the values to predict.
    // I have to turn validationData private again!!
    uint[] private validationData;
    uint public highestScore = 0;
    address public winningAddress;

    // Contract Events
    event LogPrediction(address indexed from, uint indexed accuracy, bool highScore);

    // Fallback function prevents users sending ether if contest is finished.
    function() {
        require(stage != Stages.finished);
    }

    // Constructor, must provide an array of values to validate predictions against.
    function PredictionChecker (uint[] valData) {
        validationData = valData;
        openingTime = now;
    }

    // Submit a set of predictions.
    function submitPredictions(uint[] predictionData)
        timedTrasitions()
        atStage(Stages.acceptingPredictions)
    {
        // Compute the accuracy of the prediction.
        uint hits = 0;
        for (uint i = 0; i < validationData.length; i++) {
            if (validationData[i] == predictionData[i]) {
                ++hits;
            }
        }

        uint accuracy = hits * 100 / validationData.length;
        // Check if its the highest score.
        if (accuracy > highestScore) {
            winningAddress = msg.sender;
            highestScore = accuracy;
            LogPrediction(msg.sender, accuracy, true);
        }
        LogPrediction(msg.sender, accuracy, false);
    }

    // Claim the prize after submission period ends
    function claimPrize() atStage(Stages.claimingPrize) {
        require(msg.sender == winningAddress);
        nextStage();
        msg.sender.transfer(this.balance);
    }
}
