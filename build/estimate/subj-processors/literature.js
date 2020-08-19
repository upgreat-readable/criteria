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
exports.Literature = void 0;
var abstractProcessor_1 = require("./abstractProcessor");
var constants = __importStar(require("../../support/constants"));
var operations_1 = require("../../support/operations");
var constants_1 = require("../../support/constants");
var Literature = /** @class */ (function (_super) {
    __extends(Literature, _super);
    function Literature() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.criterions = {
            K1: 0,
            K2: 0,
            K3: 0,
            K4: 0,
            K5: 0
        };
        _this.predefinedValues = [
            'АРГУМЕНТ', 'ПОНЯТИЕ',
            'С.одностор', 'С.поверхн', 'С.тема',
            'С.опора', 'С.упрощен', 'С.пересказ', 'С.позиция', 'С.факт',
            'С.понятие', 'С.неиспол',
            'С.послед', 'С.неразв', 'С.связь', 'С.композ'
        ];
        return _this;
    }
    /*
        если (объём < 150 слов) то K=К1=…=К5=0 и далее оценивание не производится;
        если (С.тема>0) то К1=0;
        иначе если (С.поверхн>0) то К1=1;
        иначе если (С.одностор>0) то К1=2;
        иначе К1=3;
        если (АРГУМЕНТ=0) или (С.опора>0) или (С.позиция>0) или (С.факт>=4) то К2=0;
        иначе если (С.упрощен>0) или (С.пересказ>0) или (С.факт>=3) то К2=1;
        иначе если (С.факт>=2) то К2=2;
        иначе если (С.факт=0) то К2=3;
        если (ПОНЯТИЕ=0) или (С.понятие>=2) то К3=0;
        иначе если (С.неиспол>0) или (С.понятие>=1) то К3=1;
        иначе К3=2;
        если (С.композ>0) то К4=0;
        иначе если (С.неразв>0) или (С.связь>0) то К4=1;
        иначе если (С.послед>0) то К4=2;
        иначе К4=3;
        ошРеч = число речевых ошибок согласно разделу 2.2;
        К5 = max(0, округление_вниз(3.5 – 0.5*ошРеч));
        К = К1 + …. + К5. Максимальное значение К = 14.
     */
    Literature.prototype.analyze = function () {
        _super.prototype.analyze.call(this);
        if (this.wordsCount < constants.literatureWordsLowLimit) {
            return this.criterions;
        }
        this.setK1();
        this.setK2();
        this.setK3();
        this.setK4();
        this.setK5();
        if (operations_1.Operations.objectSum(this.criterions) > constants_1.literatureMaxPoints) {
            throw new Error('Высчитанное количество баллов превысило максимально допустимое значение.');
        }
        return this.criterions;
    };
    Literature.prototype.setK1 = function () {
        if (this.formattedEr['С.тема'] > 0) {
            this.criterions.K1 = 0;
        }
        else if (this.formattedEr['С.поверхн'] > 0) {
            this.criterions.K1 = 1;
        }
        else if (this.formattedEr['С.одностор'] > 0) {
            this.criterions.K1 = 2;
        }
        else {
            this.criterions.K1 = 3;
        }
    };
    Literature.prototype.setK2 = function () {
        if (this.formattedEr['АРГУМЕНТ'] === 0 || this.formattedEr['С.опора'] > 0 || this.formattedEr['С.позиция'] > 0 || this.formattedEr['С.факт'] >= 4) {
            this.criterions.K2 = 0;
        }
        else if (this.formattedEr['С.упрощен'] > 0 || this.formattedEr['С.пересказ'] > 0 || this.formattedEr['С.факт'] >= 3) {
            this.criterions.K2 = 1;
        }
        else if (this.formattedEr['С.факт'] >= 2) {
            this.criterions.K2 = 2;
        }
        else if (this.formattedEr['С.факт'] === 0) {
            this.criterions.K2 = 3;
        }
    };
    Literature.prototype.setK3 = function () {
        if (this.formattedEr['ПОНЯТИЕ'] === 0 || this.formattedEr['С.понятие'] >= 2) {
            this.criterions.K3 = 0;
        }
        else if (this.formattedEr['С.неиспол'] > 0 || this.formattedEr['С.понятие'] >= 1) {
            this.criterions.K3 = 1;
        }
        else {
            this.criterions.K3 = 2;
        }
    };
    Literature.prototype.setK4 = function () {
        if (this.formattedEr['С.композ'] > 0) {
            this.criterions.K4 = 0;
        }
        else if (this.formattedEr['С.неразв'] > 0 || this.formattedEr['С.связь'] > 0) {
            this.criterions.K4 = 1;
        }
        else if (this.formattedEr['С.послед'] > 0) {
            this.criterions.K4 = 2;
        }
        else {
            this.criterions.K4 = 3;
        }
    };
    Literature.prototype.setK5 = function () {
        this.criterions.K5 = Math.max(0, Math.floor(3.5 - 0.5 * this.formattedEr['ошРеч']));
    };
    return Literature;
}(abstractProcessor_1.AbstractProcessor));
exports.Literature = Literature;
