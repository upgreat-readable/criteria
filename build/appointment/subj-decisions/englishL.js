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
exports.EnglishL = void 0;
var abstractDecision_1 = require("./abstractDecision");
var EnglishL = /** @class */ (function (_super) {
    __extends(EnglishL, _super);
    function EnglishL() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnglishL.prototype.decide = function () {
        this.checkCriterionExists(['K1', 'K2', 'K3', 'K4', 'K5']);
        //расхождение итоговых оценок К двух экспертов составляет 4 или более баллов
        if (Math.abs(this.firstCritSum - this.secondCritSum) >= 4) {
            this.decisionResult.decision = true;
        }
        return this.decisionResult;
    };
    return EnglishL;
}(abstractDecision_1.abstractDecision));
exports.EnglishL = EnglishL;
