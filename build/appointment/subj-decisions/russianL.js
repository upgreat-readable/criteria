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
exports.RussianL = void 0;
var abstractDecision_1 = require("./abstractDecision");
var RussianL = /** @class */ (function (_super) {
    __extends(RussianL, _super);
    function RussianL() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RussianL.prototype.decide = function () {
        this.checkCriterionExists(['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10', 'K11', 'K12']);
        //расхождение итоговых оценок К двух экспертов составляет 7 или более баллов
        if (Math.abs(this.firstCritSum - this.secondCritSum) >= 8) {
            this.decisionResult.decision = true;
        }
        //либо расхождение оценок K7 составляет 2 или более баллов
        if (Math.abs(this.firstFileCriterions['K7'] - this.secondFileCriterions['K7']) >= 2) {
            this.decisionResult.decision = true;
        }
        //либо расхождение оценок K8 составляет 2 или более баллов
        if (Math.abs(this.firstFileCriterions['K8'] - this.secondFileCriterions['K8']) >= 2) {
            this.decisionResult.decision = true;
        }
        return this.decisionResult;
    };
    return RussianL;
}(abstractDecision_1.abstractDecision));
exports.RussianL = RussianL;
