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
exports.Literature = void 0;
var abstractDecision_1 = require("./abstractDecision");
var Literature = /** @class */ (function (_super) {
    __extends(Literature, _super);
    function Literature() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Literature.prototype.decide = function () {
        this.checkCriterionExists(['K1', 'K2', 'K3', 'K4', 'K5']);
        //расхождение итоговых оценок К двух экспертов составляет 7 или более баллов
        if (Math.abs(this.firstCritSum - this.secondCritSum) >= 7) {
            this.decisionResult.decision = true;
        }
        //либо расхождение по любому из критериев K1..К5 составляет 2 или более баллов
        for (var i in this.firstFileCriterions) {
            if (Math.abs(this.firstFileCriterions[i] - this.secondFileCriterions[i]) >= 2) {
                this.decisionResult.decision = true;
                break;
            }
        }
        //@todo либо расхождение по оценке K1=0
        if ((this.firstFileCriterions['K1'] === 0 && this.secondFileCriterions['K8'] !== 0) ||
            (this.secondFileCriterions['K1'] === 0 && this.firstFileCriterions['K8'] !== 0)) {
            this.decisionResult.decision = true;
        }
        return this.decisionResult;
    };
    return Literature;
}(abstractDecision_1.abstractDecision));
exports.Literature = Literature;
