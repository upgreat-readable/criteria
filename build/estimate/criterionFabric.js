"use strict";
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
exports.CriterionFabric = void 0;
var russianL_1 = require("./subj-processors/russianL");
var literature_1 = require("./subj-processors/literature");
var socialScience_1 = require("./subj-processors/socialScience");
var history_1 = require("./subj-processors/history");
var subjCodes = __importStar(require("../support/subjectCodes"));
var englishL_1 = require("./subj-processors/englishL");
var CriterionFabric = /** @class */ (function () {
    function CriterionFabric(markUpExample) {
        this.markUpExample = markUpExample;
        this.subject = this.getSubj();
    }
    CriterionFabric.prototype.run = function () {
        var subjObject = this.decisionCriterionClass(this.subject);
        return subjObject.analyze();
    };
    CriterionFabric.prototype.decisionCriterionClass = function (subj) {
        if (!subj) {
            throw new Error('Не был получен код предмета.');
        }
        switch (subj) {
            case subjCodes.russianLanguage:
                return new russianL_1.RussianL(this.markUpExample);
            case subjCodes.literature:
                return new literature_1.Literature(this.markUpExample);
            case subjCodes.socialScience:
                return new socialScience_1.SocialScience(this.markUpExample);
            case subjCodes.history:
                return new history_1.History(this.markUpExample);
            case subjCodes.englishLanguage:
                return new englishL_1.EnglishL(this.markUpExample);
        }
        throw new Error('Данный предмет не поддерживается сервисом распознавания критериев.');
    };
    CriterionFabric.prototype.getSubj = function () {
        return this.markUpExample.metas.subject;
    };
    return CriterionFabric;
}());
exports.CriterionFabric = CriterionFabric;
