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
var abstractProcessor_1 = require("./abstractProcessor");
var SocialScience = /** @class */ (function (_super) {
    __extends(SocialScience, _super);
    function SocialScience() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.criterions = {
            K1: 0,
            K2: 0,
            K3: 0,
            K4: 0
        };
        _this.predefinedValues = [
            'ИДЕЯ', 'ПОНЯТИЕ', 'ТЕОРИЯ', 'ЛОГИКА', 'ПРИМЕР.ОБЩ', 'ПРИМЕР.ЛИЧ', 'ПРИМЕР.ИСТ',
            'о.смысл', 'о.подмена', 'о.пересказ',
            'о.понятие', 'о.теория', 'о.теорсвязь', 'о.нехватает', 'о.упрощ',
            'о.рассужд', 'о.вывод',
            'о.примсвязь', 'о.подтв', 'о.дубл', 'о.факт', 'о.подробн'
        ];
        return _this;
    }
    /*
        если (ИДЕЯ>0) и (о.смысл=0) и (о.подмена=0) и (о.пересказ=0) то К1=1;
        иначе К=К1=К2=К3=К4=0 и далее оценивание не производится;
        если (о.упрощ>0) то K2=0; иначе
        К2 = max(0, [ПОНЯТИЕ>0] + [ТЕОРИЯ>0] – [о.понятие+о.теория>0] – о.теорсвязь – о.нехватает);
        К3 = max(0, [ЛОГИКА>0] – о.рассужд – о.вывод);
        К4 = max(0, min(2, [ПРИМЕР.ОБЩ>1] + [ПРИМЕР.ЛИЧ>1] + [ПРИМЕР.ИСТ>1]) – о.примсвязь – о.подтв – о.дубл – о.факт – о.подробн);
        К = К1 + …. + К4. Максимальное значение К = 6.
     */
    SocialScience.prototype.analyze = function () {
        _super.prototype.analyze.call(this);
        this.setK1();
        if (this.criterions.K1 === 0) {
            return this.criterions;
        }
        this.setK2();
        this.setK3();
        this.setK4();
        return this.criterions;
    };
    SocialScience.prototype.setK1 = function () {
        if (this.formattedEr['ИДЕЯ'] > 0 && this.formattedEr['о.смысл'] === 0 && this.formattedEr['о.подмена'] === 0 && this.formattedEr['о.пересказ'] === 0) {
            this.criterions.K1 = 1;
        }
    };
    SocialScience.prototype.setK2 = function () {
        if (this.formattedEr['о.упрощ'] > 0) {
            this.criterions.K2 = 0;
        }
        else {
            var conceptFlag = this.formattedEr['ПОНЯТИЕ'] > 0 ? 1 : 0;
            var theoryFlag = this.formattedEr['ТЕОРИЯ'] > 0 ? 1 : 0;
            var sumFlag = (this.formattedEr['о.понятие'] + this.formattedEr['о.теория']) > 0 ? 1 : 0;
            this.criterions.K2 = Math.max(0, (conceptFlag + theoryFlag - sumFlag - this.formattedEr['о.теорсвязь'] - this.formattedEr['о.нехватает']));
        }
    };
    SocialScience.prototype.setK3 = function () {
        var logicFlag = this.formattedEr['ЛОГИКА'] > 0 ? 1 : 0;
        this.criterions.K3 = Math.max(0, (logicFlag - this.formattedEr['о.рассужд'] - this.formattedEr['о.вывод']));
    };
    SocialScience.prototype.setK4 = function () {
        var exSoc = this.formattedEr['ПРИМЕР.ОБЩ'] > 1 ? 1 : 0;
        var exPerson = this.formattedEr['ПРИМЕР.ЛИЧ'] > 1 ? 1 : 0;
        var exHist = this.formattedEr['ПРИМЕР.ИСТ'] > 1 ? 1 : 0;
        this.criterions.K4 = Math.max(0, Math.min(2, exSoc + exPerson + exHist) - this.formattedEr['о.примсвязь'] - this.formattedEr['о.подтв']
            - this.formattedEr['о.дубл'] - this.formattedEr['о.факт'] - this.formattedEr['о.подробн']);
    };
    return SocialScience;
}(abstractProcessor_1.AbstractProcessor));
exports.SocialScience = SocialScience;
