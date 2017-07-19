pragma solidity ^0.4.11;

contract StateMachine {

    enum Stages {
        acceptingPredictions,
        claimingPrize,
        finished
    }
    uint public openingTime;

    Stages public stage = Stages.acceptingPredictions;

    modifier atStage(Stages _stage) {
        require(stage == _stage);
        _;
    }

    modifier transitionNext() {
        _;
        nextStage();
    }

    modifier timedTrasitions() {
        if (stage == Stages.acceptingPredictions && now > openingTime + 10 days) {
            nextStage();
        }
        _;
    }

    function nextStage() internal {
        stage = Stages(uint(stage) + 1);
    }

    function returnStage() constant returns (Stages) {
        return stage;
    }
}
