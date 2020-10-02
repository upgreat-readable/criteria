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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RussianL = void 0;
var abstractProcessor_1 = require("./abstractProcessor");
var constants = __importStar(require("../../support/constants"));
var operations_1 = require("../../support/operations");
var constants_1 = require("../../support/constants");
var RussianL = /** @class */ (function (_super) {
    __extends(RussianL, _super);
    function RussianL() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.criterions = {
            K1: 0,
            K2: 0,
            K3: 0,
            K4: 0,
            K5: 0,
            K6: 0,
            K7: 0,
            K8: 0,
            K9: 0,
            K10: 0,
            K11: 0,
            K12: 0
        };
        _this.predefinedValues = [
            'ПРОБЛЕМА', 'ПРИМЕР', 'ПОЯСНЕНИЕ', 'СВЯЗЬ', 'ПОЗИЦИЯ', 'ОТНОШЕНИЕ',
            'П.проблема', 'П.факт',
            'П.опора', 'П.пересказ', 'П.факткомм', 'П.другая', 'П.копир',
            'П.позиция',
            'П.отнош', 'П.обоснов',
            'П.однообр', 'П.точность'
        ];
        _this.shortTextFlag = 0;
        return _this;
    }
    /*
            если (объём < 70 слов) то K=К1=…=К12=0 и далее оценивание не производится;
            если (ПРОБЛЕМА>0) и (П.проблема=0) и (П.факт=0)  то К1=1;
            иначе К1=К2=К3=К4=0 и переход к вычислению К5–К12;
            если (П.опора+П.пересказ+П.факткомм+П.другая+П.копир>0) то К2=0;
            иначе если (ПРИМЕР>=2) и (ПОЯСНЕНИЕ>=2) и (СВЯЗЬ>=1) то К2=5;
            иначе если (ПРИМЕР>=2) и (ПОЯСНЕНИЕ+СВЯЗЬ>=2) то К2=4;
            иначе если (ПРИМЕР+ПОЯСНЕНИЕ+СВЯЗЬ>=3) то К2=3;
            иначе если (ПРИМЕР=2) то К2=2;
            иначе если (ПРИМЕР=1) то К2=1;
            иначе К2=0;
            если (ПОЗИЦИЯ>0) и (П.позиция=0) то К3=1 иначе К3=0;
            если (ОТНОШЕНИЕ>0) и (П.отнош+П.обоснов=0) то К4=1 иначе К4=0;
            КороткийТекст = [объём < 150 слов]
            К5 = max(2 – ошЛог, 0);
            К7 = max(0, округление_вниз(3 – 0.5*ошОрф – КороткийТекст));
            К8 = max(0, округление_вниз(3.5 – 0.5*ошПункт – КороткийТекст));
            К9 = max(0, округление_вниз(2 – 0.5*ошГрам – КороткийТекст));
            К10 = max(0, округление_вниз(2.5 – 0.5*ошРеч – КороткийТекст));
            К11 = [ошЭтич = 0];
            К12 = [ошФакт = 0];
            если (П.однообр+П.точность=0) и (K10>=2) то K6 = 2;
            иначе если (П.однообр+П.точность=1) или (K10<2) то K6 = 1;
            иначе К6=0;
            К = К1 + …. + К12. Максимальное значение К = 24.
     */
    RussianL.prototype.analyze = function () {
        _super.prototype.analyze.call(this);
        if (this.wordsCount < constants.russianWordsLowLimit) {
            return this.criterions;
        }
        this.shortTextFlag = this.wordsCount < constants.russianShortTextCount ? 1 : 0;
        this.setK1();
        if (this.criterions.K1 !== 0) {
            this.setK2();
            this.setK3();
            this.setK4();
        }
        this.setK5();
        this.setK7();
        this.setK8();
        this.setK9();
        this.setK10();
        this.setK11();
        this.setK12();
        this.setK6();
        if (operations_1.Operations.objectSum(this.criterions) > constants_1.russianMaxPoints) {
            throw new Error('Высчитанное количество баллов превысило максимально допустимое значение.');
        }
        return this.criterions;
    };
    RussianL.prototype.setK1 = function () {
        if (this.formattedEr['ПРОБЛЕМА'] > 0 && this.formattedEr['П.проблема'] === 0 && this.formattedEr['П.факт'] === 0) {
            this.criterions.K1 = 1;
        }
    };
    RussianL.prototype.setK2 = function () {
        if (this.formattedEr['П.опора'] + this.formattedEr['П.пересказ'] + this.formattedEr['П.факткомм'] + this.formattedEr['П.другая'] + this.formattedEr['П.копир'] > 0) {
            this.criterions.K2 = 0;
        }
        else if (this.formattedEr['ПРИМЕР'] >= 2 && this.formattedEr['ПОЯСНЕНИЕ'] >= 2 && this.formattedEr['СВЯЗЬ'] >= 1) {
            this.criterions.K2 = 5;
        }
        else if (this.formattedEr['ПРИМЕР'] >= 2 && (this.formattedEr['ПОЯСНЕНИЕ'] + this.formattedEr['СВЯЗЬ']) >= 2) {
            this.criterions.K2 = 4;
        }
        else if (this.formattedEr['ПРИМЕР'] + this.formattedEr['ПОЯСНЕНИЕ'] + this.formattedEr['СВЯЗЬ'] >= 3) {
            this.criterions.K2 = 3;
        }
        else if (this.formattedEr['ПРИМЕР'] === 2) {
            this.criterions.K2 = 2;
        }
        else if (this.formattedEr['ПРИМЕР'] === 1) {
            this.criterions.K2 = 1;
        }
        else {
            this.criterions.K2 = 0;
        }
    };
    RussianL.prototype.setK3 = function () {
        if (this.formattedEr['ПРИМЕР'] > 0 && this.formattedEr['П.позиция'] === 0) {
            this.criterions.K3 = 1;
        }
        else {
            this.criterions.K3 = 0;
        }
    };
    RussianL.prototype.setK4 = function () {
        if (this.formattedEr['ОТНОШЕНИЕ'] > 0 && (this.formattedEr['П.отнош'] + this.formattedEr['П.обоснов'] === 0)) {
            this.criterions.K4 = 1;
        }
        else {
            this.criterions.K4 = 0;
        }
    };
    RussianL.prototype.setK5 = function () {
        this.criterions.K5 = Math.max(2 - this.formattedEr['ошЛог'], 0);
    };
    RussianL.prototype.setK6 = function () {
        if (this.formattedEr['П.однообр'] + this.formattedEr['П.точность'] === 0 && this.criterions.K10 >= 2) {
            this.criterions.K6 = 2;
        }
        else if (this.formattedEr['П.однообр'] + this.formattedEr['П.точность'] === 1 || this.criterions.K10 < 2) {
            this.criterions.K6 = 1;
        }
        else {
            this.criterions.K6 = 0;
        }
    };
    RussianL.prototype.setK7 = function () {
        // this.criterions.K7 = Math.max(0, Math.floor(3 - 0.5 * this.formattedEr['ошОрф']) - this.shortTextFlag)
        this.criterions.K7 = 3;
    };
    RussianL.prototype.setK8 = function () {
        // this.criterions.K8 = Math.max(0, Math.floor(3.5 - 0.5 * this.formattedEr['ошПункт'] - this.shortTextFlag))
        this.criterions.K8 = 3.5;
    };
    RussianL.prototype.setK9 = function () {
        this.criterions.K9 = Math.max(0, Math.floor(2 - 0.5 * this.formattedEr['ошГрам'] - this.shortTextFlag));
    };
    RussianL.prototype.setK10 = function () {
        this.criterions.K10 = Math.max(0, Math.floor(2.5 - 0.5 * this.formattedEr['ошРеч'] - this.shortTextFlag));
    };
    RussianL.prototype.setK11 = function () {
        this.criterions.K11 = this.formattedEr['ошЭтич'] === 0 ? 1 : 0;
    };
    RussianL.prototype.setK12 = function () {
        this.criterions.K12 = this.formattedEr['ошФакт'] === 0 ? 1 : 0;
    };
    return RussianL;
}(abstractProcessor_1.AbstractProcessor));
exports.RussianL = RussianL;
