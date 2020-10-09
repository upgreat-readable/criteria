import { abstractDecision } from './abstractDecision';
import { thrdExpertDecision } from '../../interfaces/iSubjectDecision';

export class RussianLFree extends abstractDecision {
  decide(): thrdExpertDecision {
    this.checkCriterionExists(['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7']);

    //расхождение итоговых оценок К двух экспертов составляет 8 или более баллов
    if (Math.abs(this.firstCritSum - this.secondCritSum) >= 8) {
      this.decisionResult.decision = true;
    }

    return this.decisionResult;
  }
}
