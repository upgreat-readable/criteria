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
var abstractProcessor_1 = require("./abstractProcessor");
var operations_1 = require("../../support/operations");
var EnglishL = /** @class */ (function (_super) {
    __extends(EnglishL, _super);
    function EnglishL() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.criterions = {
            K1: 0,
            K2: 0,
            K3: 0,
            K4: 0,
            K5: 0
        };
        _this.predefinedValues = [
            'ПРОБЛЕМА', 'ЛМНЕНИЕ', 'ПРМНЕНИЕ', 'ДОВОД', 'ОБОСНОВАНИЕ', 'ВЫВОД',
            'А.стиль', 'А.аспект', 'А.объем', 'А.непрод',
            'А.логика', 'А.нсвязь', 'А.связь', 'А.абзац', 'А.лексика', 'А.запас',
            'А.грамм', 'А.повтор', 'А.уровень', 'А.несоотв',
            'А.орф', 'А.пункт'
        ];
        _this.firstPClose = 0;
        _this.firstClose = 0;
        _this.endClose = 0;
        _this.endPClose = 0;
        _this.arReason = [];
        _this.arPReason = [];
        _this.oshPlanErrorsCount = 0;
        return _this;
    }
    /*

        ошАспекты = [ЛМНЕНИЕ=0] + [ПРМНЕНИЕ=0] + max(3 – ДОВОД, 0) + [ОБОСНОВАНИЕ=0];
        если (А.объем<200 слов) или (А.непрод>30% слов) то К1 = 0;
        иначе если (ошАспекты=0) и (А.аспект=0) и (А.стиль<=1) то К1 = 3;
        иначе если (ошАспекты=0) и (А.аспект<=2) и (А.стиль<=3), то К1 = 2;
        иначе если (ошАспекты*2+А.аспект<=4) и (А.стиль<=4), то К1 = 1;
        иначе К1 = 0;
        если (К1 = 0), то К = 0 и остальные критерии не вычисляем;
        @todo необходимо, чтобы ДОВОД-ы ЛМНЕНИЯ имели одинаковые теги с ЛМНЕНИЕ, равно как и ДОВОД-ы ПРМНЕНИЕ с ПРМНЕНИЕ
        @todo - уточнить - блоки значения ошПлан следуют один за другим и не могут быть вложены друг в друга?
        ошПлан = число блоков, отсутствующих или нарушающих порядок следования в последовательности {ПРОБЛЕМА, ЛМНЕНИЕ, {ДОВОД-ы, относящиеся к ЛМНЕНИЕ}, ПРМНЕНИЕ, {ДОВОД-ы, относящиеся к ПРМНЕНИЕ}, ОБОСНОВАНИЕ, ВЫВОД};
        если (ошПлан=0) и (А.логика=0) и (А.нсвязь=0) и (А.связь=0) и (А.абзац=0) то К2 = 3;
        иначе если (ошПлан + А.логика + А.нсвязь + А.абзац<=4) и (А.связь=0) то К2 = 2;
        иначе если (ошПлан + А.логика + А.связь + А.абзац<=8) то К2 = 1;
        иначе К2 = 0;
        если (А.лексика<=1) и (А.запас=0) то К3 = 3;
        иначе если (А.лексика+3*А.запас<=3) то К3 = 2;
        иначе если (А.лексика<=4) и (А.запас<=1) то К3 = 1;
        иначе К3 = 0;

        если (А.грамм<=2) и (А.уровень=0) и (А.несоотв=0) то К4 = 3;
        иначе если (А.грамм<=4) и (А.уровень=0) и (А.несоотв=0) то К4 = 2;
        иначе если (А.грамм<=7) и (А.уровень=0) и (А.несоотв<=1) то К4 = 1;
        иначе К4 = 0;

        если (А.орф<=1) и (А.пункт<=1) то К5 = 2;
        иначе если (А.орф+А.пункт<=4) то К5 = 1;
        иначе К5 = 0;
        итоговая оценка K = К1 + К2 + К3 + К4 + К5  (максимальное значение К=14).
     */
    EnglishL.prototype.analyze = function () {
        //считаем количество ошПлан
        this.setOshErrors();
        _super.prototype.analyze.call(this);
        this.setK1();
        if (this.criterions.K1 === 0) {
            return this.criterions;
        }
        this.setK2();
        this.setK3();
        this.setK4();
        this.setK5();
        return this.criterions;
    };
    EnglishL.prototype.setK1 = function () {
        var oshAspects = this.setOshAspects();
        var unproductivePercent = this.setUnproductivePercent();
        if (this.formattedEr['А.объем'] || unproductivePercent > 30) {
            this.criterions.K1 = 0;
        }
        else if (oshAspects === 0 && this.formattedEr['А.аспект'] === 0 && this.formattedEr['А.стиль'] <= 1) {
            this.criterions.K1 = 3;
        }
        else if (oshAspects === 0 && this.formattedEr['А.аспект'] <= 2 && this.formattedEr['А.стиль'] <= 3) {
            this.criterions.K1 = 2;
        }
        else if ((oshAspects * 2 + this.formattedEr['А.аспект']) <= 4 && this.formattedEr['А.стиль'] <= 4) {
            this.criterions.K1 = 1;
        }
        else {
            this.criterions.K1 = 0;
        }
    };
    EnglishL.prototype.setK2 = function () {
        if (this.oshPlanErrorsCount === 0 && this.formattedEr['А.логика'] === 0 &&
            this.formattedEr['А.нсвязь'] === 0 && this.formattedEr['А.связь'] === 0 && this.formattedEr['А.абзац'] === 0) {
            this.criterions.K2 = 3;
        }
        else if (operations_1.Operations.sum(this.oshPlanErrorsCount, this.formattedEr['А.логика'], this.formattedEr['А.нсвязь'], this.formattedEr['А.абзац']) <= 4 &&
            this.formattedEr['А.связь'] === 0) {
            this.criterions.K2 = 2;
        }
        else if (operations_1.Operations.sum(this.oshPlanErrorsCount, this.formattedEr['А.логика'], this.formattedEr['А.связь'], this.formattedEr['А.абзац']) <= 8) {
            this.criterions.K2 = 1;
        }
        else {
            this.criterions.K2 = 0;
        }
    };
    EnglishL.prototype.setK3 = function () {
        if (this.formattedEr['А.лексика'] <= 1 && this.formattedEr['А.запас'] === 0) {
            this.criterions.K3 = 3;
        }
        else if ((this.formattedEr['А.лексика'] + 3 * this.formattedEr['А.запас']) <= 3) {
            this.criterions.K3 = 2;
        }
        else if (this.formattedEr['А.лексика'] <= 4 && this.formattedEr['А.запас'] <= 1) {
            this.criterions.K3 = 1;
        }
        else {
            this.criterions.K3 = 0;
        }
    };
    EnglishL.prototype.setK4 = function () {
        if (this.formattedEr['А.грамм'] <= 2 && this.formattedEr['А.уровень'] === 0 && this.formattedEr['А.несоотв'] === 0) {
            this.criterions.K4 = 3;
        }
        else if (this.formattedEr['А.грамм'] <= 4 && this.formattedEr['А.уровень'] === 0 && this.formattedEr['А.несоотв'] === 0) {
            this.criterions.K4 = 2;
        }
        else if (this.formattedEr['А.грамм'] <= 7 && this.formattedEr['А.уровень'] === 0 && this.formattedEr['А.несоотв'] <= 1) {
            this.criterions.K4 = 1;
        }
        else {
            this.criterions.K4 = 0;
        }
    };
    EnglishL.prototype.setK5 = function () {
        if (this.formattedEr['А.орф'] <= 1 && this.formattedEr['А.пункт'] <= 1) {
            this.criterions.K5 = 2;
        }
        else if ((this.formattedEr['А.орф'] + this.formattedEr['А.пункт']) <= 4) {
            this.criterions.K5 = 1;
        }
        else {
            this.criterions.K5 = 0;
        }
    };
    EnglishL.prototype.setUnproductivePercent = function () {
        var resultPercent = 0;
        var upProdWordsCount = 0;
        var totalWordsCount = operations_1.Operations.countWords(this.markUpData.text);
        for (var i in this.markUpData.selections) {
            if (this.markUpData.selections[i].type === 'А.непрод') {
                upProdWordsCount += operations_1.Operations.countWords(this.markUpData.text.substring(this.markUpData.selections[i].startSelection, this.markUpData.selections[i].endSelection));
            }
        }
        if (upProdWordsCount !== 0) {
            resultPercent = (upProdWordsCount / totalWordsCount) * 100;
            return Math.round(resultPercent);
        }
        return resultPercent;
    };
    EnglishL.prototype.setOshAspects = function () {
        var param1 = this.formattedEr['ЛМНЕНИЕ'] === 0 ? 1 : 0;
        var param2 = this.formattedEr['ПРМНЕНИЕ'] === 0 ? 1 : 0;
        var param3 = Math.max(3 - this.formattedEr['ДОВОД'], 0);
        var param4 = this.formattedEr['ОБОСНОВАНИЕ'] === 0 ? 1 : 0;
        return param1 + param2 + param3 + param4;
    };
    //@todo параметр ошПлан до конференции считаем равным 1
    EnglishL.prototype.setOshErrors = function () {
        var oshPlanCount = 0;
        var oshHelp = [
            {
                'code': 'ПРОБЛЕМА',
                'start': 1000000,
                'end': 1000000,
            },
            {
                'code': 'ЛМНЕНИЕ',
                'start': 1000001,
                'end': 1000001,
            },
            {
                'code': 'ПРМНЕНИЕ',
                'start': 1000002,
                'end': 1000002,
            },
            {
                'code': 'ОБОСНОВАНИЕ',
                'start': 1000003,
                'end': 1000003,
            },
            {
                'code': 'ВЫВОД',
                'start': 1000004,
                'end': 1000004,
            },
        ];
        //установим координаты смысловых блоков, участвующих в расчёте ОшПлан
        for (var i in this.markUpData.selections) {
            for (var q in oshHelp) {
                if (oshHelp[q].code === this.markUpData.selections[i].type) {
                    oshHelp[q].start = this.markUpData.selections[i].startSelection;
                    oshHelp[q].end = this.markUpData.selections[i].endSelection;
                }
            }
        }
        console.log('----------' + JSON.stringify(oshHelp, null, 4));
        var errorsCount = 0;
        oshHelp.forEach(function (item, key, array) {
            if (array[key].start > 1000000 && array[key].end > 1000000) {
                errorsCount++;
                return;
            }
            // console.log('-------'+array[key+1].start);
            if (key !== array.length - 1) {
                if ((array[key + 1].start < 100000 && array[key + 1].end < 100000) &&
                    (array[key].start > array[key + 1].start && array[key + 1].end < array[key].end)) {
                    console.log('----' + array[key].code);
                    errorsCount++;
                }
                // if (key !== 0) {
                //     //в случае, если элемент НеНулевой, а перед ним - нулевой, то конкретный надо сравнить с ближайшим (влево), имеющим координаты
                //     if (array[key].start !== 0 && array[key].end !== 0 && array[key - 1].start !== 0 && array[key - 1].end !== 0) {
                //         // for (var i = key; i !== 0; i--) {
                //         //     if (oshHelp[i].start !== 0 && oshHelp[i].end !== 0) {
                //         //         if (array[key].start > oshHelp[i].start && oshHelp[i].end < array[key].end) {
                //         //
                //         //         }
                //         //     }
                //         // }
                //         errorsCount++
                //     }
                // }
                // if (array[key+1].start === 0 && array[key+1].end === 0) {
                //     errorsCount++
                // }
            }
            else {
                if (array[key - 1].start > 100000 && array[key - 1].end > 100000) {
                    errorsCount++;
                }
            }
        });
        console.log('oshErrorsCount - ' + errorsCount);
    };
    return EnglishL;
}(abstractProcessor_1.AbstractProcessor));
exports.EnglishL = EnglishL;
