import { abstractDecision } from './abstractDecision';
import { thrdExpertDecision } from '../../interfaces/iSubjectDecision';

export class SocialScience extends abstractDecision {
  decide(): thrdExpertDecision {
    this.checkCriterionExists(['K1', 'K2', 'K3', 'K4']);
    //расхождение итоговых оценок К двух экспертов составляет 3 или более баллов
    if (Math.abs(this.firstCritSum - this.secondCritSum) >= 3) {
      this.decisionResult.decision = true;
    }

    //либо расхождение по критерию K2 или К4 составляет 2 балла
    if (
      Math.abs(
        this.firstFileCriterions['K2'] - this.secondFileCriterions['K2'],
      ) === 2
    ) {
      this.decisionResult.decision = true;
    }
    if (
      Math.abs(
        this.firstFileCriterions['K4'] - this.secondFileCriterions['K4'],
      ) === 2
    ) {
      this.decisionResult.decision = true;
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
