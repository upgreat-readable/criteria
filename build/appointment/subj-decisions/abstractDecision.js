"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abstractDecision = void 0;
var abstractDecision = /** @class */ (function () {
    function abstractDecision(firstFile, secondFile) {
        this.firstCritSum = 0;
        this.secondCritSum = 0;
        //false - де-юре третий эксперт не нужен
        this.decisionResult = { decision: false };
        this.firstFileCriterions = firstFile.criteria;
        this.secondFileCriterions = secondFile.criteria;
        this.calculateSum();
    }
    abstractDecision.prototype.calculateSum = function () {
        for (var i in this.firstFileCriterions) {
            this.firstCritSum = this.firstCritSum + this.firstFileCriterions[i];
        }
        for (var j in this.secondFileCriterions) {
            this.secondCritSum = this.secondCritSum + this.secondFileCriterions[j];
        }
    };
    abstractDecision.prototype.checkCriterionExists = function (criteria) {
        var _this = this;
        criteria.forEach(function (item, key, array) {
            if (!_this.firstFileCriterions.hasOwnProperty(item) || !_this.secondFileCriterions.hasOwnProperty(item)) {
                throw new Error('Критерий ' + item + ' не существует в полученной разметке');
            }
        });
    };
    return abstractDecision;
}());
exports.abstractDecision = abstractDecision;
