import {MarkUpData} from "../interfaces/iCriterionFabric";
import * as subjCodes from "../support/subjectCodes";
import {RussianL} from "./subj-decisions/russianL";
import {History} from "./subj-decisions/history";
import {Literature} from "./subj-decisions/literature";
import {SocialScience} from "./subj-decisions/socialScience";
import {EnglishL} from "./subj-decisions/englishL";
import {abstractDecision} from "./subj-decisions/abstractDecision";

export class AppointmentFabric {
    firstMarkUp: MarkUpData
    secondMarkUp: MarkUpData

    subject: string

    constructor(firstMarkUp: any, secondMarkUp: any) {
        this.firstMarkUp = firstMarkUp
        this.secondMarkUp = secondMarkUp

        this.subject = this.getSubj()
    }

    appointThirdExpert(): object {
        let subjObject = this.decisionSubjectClass(this.subject)
        return subjObject.decide()
    }

    decisionSubjectClass(subj: string) : abstractDecision {
        if (!subj) {
            throw new Error('Не был получен код предмета.')
        }

        switch (subj) {
            case subjCodes.russianLanguage:
                return new RussianL(this.firstMarkUp, this.secondMarkUp)
            case subjCodes.literature:
                return new Literature(this.firstMarkUp, this.secondMarkUp)
            case subjCodes.socialScience:
                return new SocialScience(this.firstMarkUp, this.secondMarkUp)
            case subjCodes.history:
                return new History(this.firstMarkUp, this.secondMarkUp)
            case subjCodes.englishLanguage:
                return new EnglishL(this.firstMarkUp, this.secondMarkUp)
        }
        throw new Error('Данный предмет не поддерживается сервисом распознавания критериев.')
    }

    public getSubj(): string {
        if (this.firstMarkUp.meta.subject !== this.secondMarkUp.meta.subject) {
            throw new Error('В сервис назначения третьего эксперта были отправлены разметки разных предметов.')
        }

        return this.firstMarkUp.meta.subject
    }

}
