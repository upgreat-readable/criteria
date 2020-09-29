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
exports.AppointmentFabric = void 0;
var subjCodes = __importStar(require("../support/subjectCodes"));
var russianL_1 = require("./subj-decisions/russianL");
var history_1 = require("./subj-decisions/history");
var literature_1 = require("./subj-decisions/literature");
var socialScience_1 = require("./subj-decisions/socialScience");
var englishL_1 = require("./subj-decisions/englishL");
var AppointmentFabric = /** @class */ (function () {
    function AppointmentFabric(firstMarkUp, secondMarkUp) {
        this.firstMarkUp = firstMarkUp;
        this.secondMarkUp = secondMarkUp;
        this.subject = this.getSubj();
    }
    AppointmentFabric.prototype.appointThirdExpert = function () {
        var subjObject = this.decisionSubjectClass(this.subject);
        return subjObject.decide();
    };
    AppointmentFabric.prototype.decisionSubjectClass = function (subj) {
        if (!subj) {
            throw new Error('Не был получен код предмета.');
        }
        switch (subj) {
            case subjCodes.russianLanguage:
            case subjCodes.russianLanguageFree:
                return new russianL_1.RussianL(this.firstMarkUp, this.secondMarkUp);
            case subjCodes.literature:
                return new literature_1.Literature(this.firstMarkUp, this.secondMarkUp);
            case subjCodes.socialScience:
                return new socialScience_1.SocialScience(this.firstMarkUp, this.secondMarkUp);
            case subjCodes.history:
                return new history_1.History(this.firstMarkUp, this.secondMarkUp);
            case subjCodes.englishLanguage:
            case subjCodes.englishLanguageFree:
                return new englishL_1.EnglishL(this.firstMarkUp, this.secondMarkUp);
        }
        throw new Error('Данный предмет не поддерживается сервисом распознавания критериев.');
    };
    AppointmentFabric.prototype.getSubj = function () {
        if (this.firstMarkUp.meta.subject !== this.secondMarkUp.meta.subject) {
            throw new Error('В сервис назначения третьего эксперта были отправлены разметки разных предметов.');
        }
        return this.firstMarkUp.meta.subject;
    };
    return AppointmentFabric;
}());
exports.AppointmentFabric = AppointmentFabric;
