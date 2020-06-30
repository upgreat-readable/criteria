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
exports.SocialScience = void 0;
var abstractDecision_1 = require("./abstractDecision");
var SocialScience = /** @class */ (function (_super) {
    __extends(SocialScience, _super);
    function SocialScience() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SocialScience.prototype.decide = function () {
        this.checkCriterionExists(['K1', 'K2', 'K3', 'K4']);
        //расхождение итоговых оценок К двух экспертов составляет 3 или более баллов
        if (Math.abs(this.firstCritSum - this.secondCritSum) >= 3) {
            this.decisionResult.decision = true;
        }
        //либо расхождение по критерию K2 или К4 составляет 2 балла
        if (Math.abs(this.firstFileCriterions['K2'] - this.secondFileCriterions['K2']) === 2) {
            this.decisionResult.decision = true;
        }
        if (Math.abs(this.firstFileCriterions['K4'] - this.secondFileCriterions['K4']) === 2) {
            this.decisionResult.decision = true;
        }
        //@todo либо расхождение по оценке K1=0
        if ((this.firstFileCriterions['K1'] === 0 && this.secondFileCriterions['K8'] !== 0) ||
            (this.secondFileCriterions['K1'] === 0 && this.firstFileCriterions['K8'] !== 0)) {
            this.decisionResult.decision = true;
        }
        return this.decisionResult;
    };
    return SocialScience;
}(abstractDecision_1.abstractDecision));
exports.SocialScience = SocialScience;
