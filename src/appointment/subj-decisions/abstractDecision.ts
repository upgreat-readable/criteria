import {ArCriterions, MarkUpData} from "../../interfaces/iCriterionFabric";
import {thrdExpertDecision} from "../../interfaces/iSubjectDecision";

export abstract class abstractDecision
{
    firstFileCriterions: ArCriterions
    secondFileCriterions: ArCriterions

    firstCritSum: number = 0
    secondCritSum: number = 0

    //false - де-юре третий эксперт не нужен
    decisionResult: thrdExpertDecision = {decision: false}

    constructor(firstFile: MarkUpData, secondFile: MarkUpData) {
        this.firstFileCriterions = firstFile.criteria
        this.secondFileCriterions = secondFile.criteria

        this.calculateSum()
    }

    calculateSum(): void {
        for (let i in this.firstFileCriterions) {
            this.firstCritSum = this.firstCritSum + this.firstFileCriterions[i]
        }

        for (let j in this.secondFileCriterions) {
            this.secondCritSum = this.secondCritSum + this.secondFileCriterions[j]
        }
    }

    checkCriterionExists(criteria: string[]): void {
        criteria.forEach((item, key, array) => {
            if (!this.firstFileCriterions.hasOwnProperty(item) || !this.secondFileCriterions.hasOwnProperty(item))  {
                throw new Error('Критерий ' + item + ' не существует в полученной разметке')
            }
        })
    }

    abstract decide(): thrdExpertDecision
}
