import {RussianL} from "./subj-processors/russianL";
import {AbstractProcessor} from "./subj-processors/abstractProcessor";
import * as iCriterion from "../interfaces/iCriterionFabric";
import {Literature} from "./subj-processors/literature";
import {SocialScience} from "./subj-processors/socialScience";
import {History} from "./subj-processors/history";
import * as subjCodes from "../support/subjectCodes"
import {EnglishL} from "./subj-processors/englishL";

export class CriterionFabric implements iCriterion.ICriterionFabric
{
    markUpExample: any
    subject: string

    constructor(markUpExample: object) {
        this.markUpExample = markUpExample
        this.subject = this.getSubj()
    }

    public run() : object {
        let subjObject = this.decisionCriterionClass(this.subject)
        return subjObject.analyze()
    }

    public decisionCriterionClass(subj: string) : AbstractProcessor {
        if (!subj) {
            throw new Error('Не был получен код предмета.')
        }

        switch (subj) {
            case subjCodes.russianLanguage:
                return new RussianL(this.markUpExample)
            case subjCodes.literature:
                return new Literature(this.markUpExample)
            case subjCodes.socialScience:
                return new SocialScience(this.markUpExample)
            case subjCodes.history:
                return new History(this.markUpExample)
            case subjCodes.englishLanguage:
                return new EnglishL(this.markUpExample)
        }

        throw new Error('Данный предмет не поддерживается сервисом распознавания критериев.')
    }

    public getSubj(): string {
        return this.markUpExample.metas.subject
    }
}
