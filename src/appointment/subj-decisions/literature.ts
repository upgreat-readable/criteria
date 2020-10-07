import { abstractDecision } from './abstractDecision';
import { thrdExpertDecision } from '../../interfaces/iSubjectDecision';

export class Literature extends abstractDecision {
  decide(): thrdExpertDecision {
    this.checkCriterionExists(['K1', 'K2', 'K3', 'K4', 'K5']);
    //расхождение итоговых оценок К двух экспертов составляет 7 или более баллов
    if (Math.abs(this.firstCritSum - this.secondCritSum) >= 7) {
      this.decisionResult.decision = true;
    }

    //либо расхождение по любому из критериев K1..К5 составляет 2 или более баллов
    for (let i in this.firstFileCriterions) {
      if (
        Math.abs(this.firstFileCriterions[i] - this.secondFileCriterions[i]) >=
        2
      ) {
        this.decisionResult.decision = true;
        break;
      }
    }

    //@todo либо расхождение по оценке K1=0

    if (
      (this.firstFileCriterions['K1'] === 0 &&
        this.secondFileCriterions['K8'] !== 0) ||
      (this.secondFileCriterions['K1'] === 0 &&
        this.firstFileCriterions['K8'] !== 0)
    ) {
      this.decisionResult.decision = true;
    }

    return this.decisionResult;
  }
}
