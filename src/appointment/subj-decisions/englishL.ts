import {abstractDecision} from "./abstractDecision";
import {thrdExpertDecision} from "../../interfaces/iSubjectDecision";

export class EnglishL extends abstractDecision
{
    decide(): thrdExpertDecision {
        this.checkCriterionExists(['K1', 'K2', 'K3', 'K4', 'K5'])
        //расхождение итоговых оценок К двух экспертов составляет 4 или более баллов
        if (Math.abs(this.firstCritSum - this.secondCritSum) >= 4) {
            this.decisionResult.decision = true
        }

        return this.decisionResult
    }
}
