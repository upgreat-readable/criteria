"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractProcessor = void 0;
var AbstractProcessor = /** @class */ (function () {
    function AbstractProcessor(markUpData) {
        var _this = this;
        this.punctuationMarks = ['.', ',', ':', ';', '-', '–', '?', '!', '_'];
        this.wordsCount = 0;
        this.predefinedValues = [];
        this.getCountIds = function (target) {
            var result = {};
            target.forEach(function (item) {
                if (item.code !== undefined) {
                    result[item.code] ? result[item.code]++ : result[item.code] = 1;
                }
            });
            return _this.countCategoryMistakes(result);
        };
        this.markUpData = markUpData;
    }
    AbstractProcessor.prototype.countWords = function () {
        var newArray = this.markUpData.originalText.split(' '), i, j;
        for (i = 0, j = 0; i < newArray.length; i++) {
            if (this.punctuationMarks.includes(newArray[i])) {
                continue;
            }
            j++;
        }
        this.wordsCount = j;
    };
    AbstractProcessor.prototype.tallyErrors = function () {
        var arSelCounts = [];
        for (var i in this.markUpData.selections) {
            arSelCounts.push({ code: this.markUpData.selections[i].code, count: 1 });
        }
        this.formattedEr = this.getCountIds(arSelCounts);
    };
    AbstractProcessor.prototype.countCategoryMistakes = function (result) {
        //орфографические ошибки *
        var spellingMistakes = 0;
        //пунктуационные ошибки *
        var punctuationMistakes = 0;
        //грамматические ошибки
        var grammaticalMistakes = 0;
        //речевые ошибки
        var speechMistakes = 0;
        //логические ошибки
        var logicMistakes = 0;
        //фактические ошибки
        var factualMistakes = 0;
        //этические ошибки
        var ethicalMistakes = 0;
        for (var key in result) {
            if (key.match(/^Г\./)) {
                grammaticalMistakes++;
                delete result[key];
            }
            if (key.match(/^Р\./)) {
                speechMistakes++;
                delete result[key];
            }
            if (key.match(/^Л\./)) {
                logicMistakes++;
                delete result[key];
            }
            if (key.match(/^Ф\./)) {
                factualMistakes++;
                delete result[key];
            }
            if (key.match(/^Э\./)) {
                ethicalMistakes++;
                delete result[key];
            }
        }
        grammaticalMistakes !== 0 ? result['ошГрам'] = grammaticalMistakes : result['ошГрам'] = 0;
        speechMistakes !== 0 ? result['ошРеч'] = speechMistakes : result['ошРеч'] = 0;
        logicMistakes !== 0 ? result['ошЛог'] = logicMistakes : result['ошЛог'] = 0;
        factualMistakes !== 0 ? result['ошФакт'] = factualMistakes : result['ошФакт'] = 0;
        ethicalMistakes !== 0 ? result['ошЭтич'] = ethicalMistakes : result['ошЭтич'] = 0;
        //@todo зануляем непонятные ошибки
        result['ошПункт'] = 0;
        result['ошОрф'] = 0;
        this.fillBasicMarkUps(result);
        return result;
    };
    AbstractProcessor.prototype.fillBasicMarkUps = function (finalResult) {
        this.predefinedValues.forEach(function (element) {
            if (!finalResult.hasOwnProperty(element)) {
                finalResult[element] = 0;
            }
        });
    };
    AbstractProcessor.prototype.analyze = function () {
        this.countWords();
        this.tallyErrors();
    };
    return AbstractProcessor;
}());
exports.AbstractProcessor = AbstractProcessor;
