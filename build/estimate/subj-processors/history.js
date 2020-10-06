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
exports.History = void 0;
var abstractProcessor_1 = require("./abstractProcessor");
var operations_1 = require("../../support/operations");
var constants_1 = require("../../support/constants");
var History = /** @class */ (function (_super) {
    __extends(History, _super);
    function History() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.criteria = {
            K1: 0,
            K2: 0,
            K3: 0,
            K4: 0,
            K5: 0,
            K6: 0,
            K7: 0
        };
        _this.predefinedValues = [
            'СОБЫТИЕ', 'СЯП', 'РОЛЬ', 'ПРИЧИНА', 'СЛЕДСТВИЕ', 'ОЦЕНКА',
            'И.событие', 'И.сяп', 'И.период',
            'И.личность', 'И.лсвязь', 'И.лпериод', 'И.лроль', 'И.лдейств',
            'И.причин', 'И.следств',
            'И.влиян', 'И.упрощ',
            'И.понятие', 'И.неиспол',
            'И.факт',
            'И.излож'
        ];
        _this.roles = [
            {
                'roleId': 1,
                'code': 'РОЛЬ',
                'tag': '',
                'count': 0,
                'elems': {
                    'И.личность': 0,
                    'И.лсвязь': 0,
                    'И.лпериод': 0,
                    'И.лроль': 0,
                    'И.лдейств': 0
                }
            },
            {
                'roleId': 2,
                'code': 'РОЛЬ',
                'tag': '',
                'count': 0,
                'elems': {
                    'И.личность': 0,
                    'И.лсвязь': 0,
                    'И.лпериод': 0,
                    'И.лроль': 0,
                    'И.лдейств': 0
                }
            }
        ];
        _this.reasonConsequence = [
            {
                'rcId': 1,
                'rcIdTag': '',
                'reason': 0,
                'consequence': 0,
                'elems': {
                    'И.причин': 0,
                    'И.следств': 0
                }
            },
            {
                'rcId': 2,
                'rcIdTag': '',
                'reason': 0,
                'consequence': 0,
                'elems': {
                    'И.причин': 0,
                    'И.следств': 0
                }
            }
        ];
        return _this;
    }
    /*
        К1 = max(0, min(2, СЯП – И.сяп – И.период));
        если (К1=0) то К=К1=…=К7=0 и далее оценивание не производится;
        выделяются две совокупности фрагментов, описывающих две исторические личности:
        Личн1 = [РОЛЬ1>0] – [И.личность1 + И.лсвязь1 + И.лпериод1 + И.лроль1 + И.лдейств1 >0];
        Личн2 = [РОЛЬ2>0] – [И.личность2 + И.лсвязь2 + И.лпериод2 + И.лроль2 + И.лдейств2 >0];
        К2 = Личн1 + Личн2;
        выделяются две пары фрагментов, описывающих две причинно-следственные связи:
        ПСС1 = [ПРИЧИНА1>0 и СЛЕДСТВИЕ1>0] – [И.причин1 + И.следств1 >0];
        ПСС2 = [ПРИЧИНА2>0 и СЛЕДСТВИЕ2>0] – [И.причин2 + И.следств2 >0];
        К3 = ПСС1 + ПСС2;
        K4 = [ОЦЕНКА>0] – [И.влиян + И.упрощ>0];
        K5 = 1 – [И.понятие + И.неиспол >0];
        К6 = max(0, 3 – И.факт);
        если (К1+К2+К3+К4<5) то К7 = 0;
        иначе К7 = [И.излож=0 и К1+К2+К3+К4>=5];
        К = К1 + …. + К7. Максимальное значение К = 12.
     */
    History.prototype.analyze = function () {
        this.fillBasicRoleFragments();
        _super.prototype.analyze.call(this);
        this.setK1();
        if (this.criteria.K1 === 0) {
            return this.criteria;
        }
        this.setK2();
        this.setK3();
        this.setK4();
        this.setK5();
        this.setK6();
        this.setK7();
        if (operations_1.Operations.objectSum(this.criteria) > constants_1.historyMaxPoints) {
            throw new Error('Высчитанное количество баллов превысило максимально допустимое значение.');
        }
        return this.criteria;
    };
    History.prototype.setK1 = function () {
        this.criteria.K1 = Math.max(0, Math.min(2, operations_1.Operations.diff(this.formattedEr['СЯП'], this.formattedEr['И.сяп'], this.formattedEr['И.период'])));
    };
    //@todo оптимизировать через foreach определение двух параметров в ряду
    History.prototype.setK2 = function () {
        var sum1 = operations_1.Operations.sum(this.roles[0].elems['И.личность'], this.roles[0].elems['И.лсвязь'], this.roles[0].elems['И.лпериод'], this.roles[0].elems['И.лроль'], this.roles[0].elems['И.лдейств']);
        var factor1 = sum1 > 0 ? 1 : 0;
        var sum2 = operations_1.Operations.sum(this.roles[1].elems['И.личность'], this.roles[1].elems['И.лсвязь'], this.roles[1].elems['И.лпериод'], this.roles[1].elems['И.лроль'], this.roles[1].elems['И.лдейств']);
        var factor2 = sum2 > 0 ? 1 : 0;
        var person1 = operations_1.Operations.diff(this.roles[0].count, factor1);
        var person2 = operations_1.Operations.diff(this.roles[1].count, factor2);
        this.criteria.K2 = operations_1.Operations.sum(person1, person2);
    };
    //@todo оптимизировать через foreach определение двух параметров в ряду
    History.prototype.setK3 = function () {
        var param1;
        if (this.reasonConsequence[0].reason > 0 && this.reasonConsequence[0].consequence > 0) {
            param1 = 1;
        }
        else {
            param1 = 0;
        }
        var sumToParam2 = operations_1.Operations.sum(this.reasonConsequence[0].elems['И.причин'], this.reasonConsequence[0].elems['И.следств']);
        var param2 = sumToParam2 > 0 ? 1 : 0;
        var pss1 = param1 + param2;
        var param3;
        if (this.reasonConsequence[1].reason > 0 && this.reasonConsequence[1].consequence > 0) {
            param3 = 1;
        }
        else {
            param3 = 0;
        }
        var sumToParam4 = operations_1.Operations.sum(this.reasonConsequence[1].elems['И.причин'], this.reasonConsequence[1].elems['И.следств']);
        var param4 = sumToParam4 > 0 ? 1 : 0;
        var pss2 = param3 + param4;
        this.criteria.K3 = pss1 + pss2;
    };
    History.prototype.setK4 = function () {
        var rating = this.formattedEr['ОЦЕНКА'] > 0 ? 1 : 0;
        var sumToParam2 = operations_1.Operations.sum(this.formattedEr['И.влиян'], this.formattedEr['И.упрощ']);
        var param2 = sumToParam2 > 0 ? 1 : 0;
        this.criteria.K4 = operations_1.Operations.diff(rating, param2);
    };
    History.prototype.setK5 = function () {
        var sumToParam = operations_1.Operations.sum(this.formattedEr['И.понятие'], this.formattedEr['И.неиспол']);
        var param = sumToParam > 0 ? 1 : 0;
        this.criteria.K5 = operations_1.Operations.diff(1, param);
    };
    History.prototype.setK6 = function () {
        this.criteria.K6 = Math.max(0, 3 - this.formattedEr['И.факт']);
    };
    History.prototype.setK7 = function () {
        if (operations_1.Operations.sum(this.criteria.K1, this.criteria.K2, this.criteria.K3, this.criteria.K4) < 5) {
            this.criteria.K7 = 0;
        }
        else {
            var param1 = this.formattedEr['И.излож'] === 0 ? 1 : 0;
            var param2 = operations_1.Operations.sum(this.criteria.K1, this.criteria.K2, this.criteria.K3, this.criteria.K4) >= 5;
            if (param1 && param2) {
                this.criteria.K7 = 1;
            }
            else {
                this.criteria.K7 = 0;
            }
        }
    };
    History.prototype.fillBasicRoleFragments = function () {
        var incR = 0;
        var incP = 0;
        var incS = 0;
        for (var i in this.markUpData.selections) {
            switch (this.markUpData.selections[i].type) {
                case 'РОЛЬ':
                    this.fillTheFirstTwoRoles(incR, this.markUpData.selections[i]) ? incR++ : '';
                    break;
                case 'ПРИЧИНА':
                    this.fillTheFirstTwoReason(incP, this.markUpData.selections[i]) ? incP++ : '';
                    break;
                case 'СЛЕДСТВИЕ':
                    this.fillTheFirstTwoConsequence(incS, this.markUpData.selections[i]) ? incS++ : '';
                    break;
            }
        }
        this.setRoleFragmentVariables([0, 1]);
        this.setRcFragmentVariables([0, 1]);
    };
    /*
    @method fillTheFirstTwoRoles, fillTheFirstTwoReason, fillTheFirstTwoConsequence
    работает только с первыми двумя, встреченными итеративно элементами
     */
    History.prototype.fillTheFirstTwoRoles = function (inc, selection) {
        if ([0, 1].includes(inc)) {
            this.roles[inc].count = 1;
            this.roles[inc].tag = selection.tag;
            return true;
        }
        return false;
    };
    History.prototype.fillTheFirstTwoReason = function (inc, selection) {
        if ([0, 1].includes(inc)) {
            this.reasonConsequence[inc].reason = 1;
            this.reasonConsequence[inc].rcIdTag = selection.tag;
            return true;
        }
        return false;
    };
    History.prototype.fillTheFirstTwoConsequence = function (inc, selection) {
        if ([0, 1].includes(inc)) {
            this.reasonConsequence[inc].consequence = 1;
            return true;
        }
        return false;
    };
    History.prototype.setRoleFragmentVariables = function (arRoleIndex) {
        if (arRoleIndex === void 0) { arRoleIndex = [0, 1]; }
        for (var _i = 0, arRoleIndex_1 = arRoleIndex; _i < arRoleIndex_1.length; _i++) {
            var roleIndex = arRoleIndex_1[_i];
            var roleTag = this.roles[roleIndex].tag;
            var roleElems = this.roles[roleIndex].elems;
            for (var k in this.markUpData.selections) {
                var curCode = this.markUpData.selections[k].type;
                var curTag = this.markUpData.selections[k].tag;
                if (roleElems.hasOwnProperty(curCode) && curTag === roleTag) {
                    roleElems[curCode] = roleElems[curCode] + 1;
                }
            }
            this.roles[roleIndex].elems = roleElems;
        }
        // console.log(this.roles);
    };
    History.prototype.setRcFragmentVariables = function (arRoleIndex) {
        if (arRoleIndex === void 0) { arRoleIndex = [0, 1]; }
        for (var _i = 0, arRoleIndex_2 = arRoleIndex; _i < arRoleIndex_2.length; _i++) {
            var roleIndex = arRoleIndex_2[_i];
            var roleTag = this.reasonConsequence[roleIndex].rcIdTag;
            var roleElems = this.reasonConsequence[roleIndex].elems;
            for (var k in this.markUpData.selections) {
                var curCode = this.markUpData.selections[k].type;
                var curTag = this.markUpData.selections[k].tag;
                if (roleElems.hasOwnProperty(curCode) && curTag === roleTag) {
                    roleElems[curCode] = roleElems[curCode] + 1;
                }
            }
            this.reasonConsequence[roleIndex].elems = roleElems;
        }
        // console.log(this.reasonConsequence);
    };
    return History;
}(abstractProcessor_1.AbstractProcessor));
exports.History = History;
