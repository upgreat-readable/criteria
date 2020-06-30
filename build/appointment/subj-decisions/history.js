"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
var abstractDecision_1 = require("./abstractDecision");
var History = /** @class */ (function (_super) {
    __extends(History, _super);
    function History() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    History.prototype.decide = function () {
        this.checkCriterionExists(['K1', 'K2', 'K3', 'K6']);
        //расхождение итоговых оценок К двух экспертов составляет 5 или более баллов
        if (Math.abs(this.firstCritSum - this.secondCritSum) >= 5) {
            this.decisionResult.decision = true;
        }
        //либо расхождение по критерию K1 или К2 или К3 или К6 составляет 2 или более балла
        if (Math.abs(this.firstFileCriterions['K1'] - this.secondFileCriterions['K1']) === 2) {
            this.decisionResult.decision = true;
        }
        if (Math.abs(this.firstFileCriterions['K2'] - this.secondFileCriterions['K2']) === 2) {
            this.decisionResult.decision = true;
        }
        if (Math.abs(this.firstFileCriterions['K3'] - this.secondFileCriterions['K3']) === 2) {
            this.decisionResult.decision = true;
        }
        if (Math.abs(this.firstFileCriterions['K6'] - this.secondFileCriterions['K6']) === 2) {
            this.decisionResult.decision = true;
        }
        //либо расхождение по любым четырём или более критериям из семи
        var inc = 0;
        for (var i in this.firstFileCriterions) {
            if (Math.abs(this.firstFileCriterions[i] - this.secondFileCriterions[i])) {
                inc++;
            }
        }
        if (inc >= 4) {
            this.decisionResult.decision = true;
        }
        return this.decisionResult;
    };
    return History;
}(abstractDecision_1.abstractDecision));
exports.History = History;
