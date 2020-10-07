import { abstractDecision } from './abstractDecision';
import { thrdExpertDecision } from '../../interfaces/iSubjectDecision';

export class RussianL extends abstractDecision {
  decide(): thrdExpertDecision {
    this.checkCriterionExists([
      'K1',
      'K2',
      'K3',
      'K4',
      'K5',
      'K6',
      'K7',
      'K8',
      'K9',
      'K10',
      'K11',
      'K12',
    ]);
    //расхождение итоговых оценок К двух экспертов составляет 7 или более баллов
    if (Math.abs(this.firstCritSum - this.secondCritSum) >= 8) {
      this.decisionResult.decision = true;
    }

    //либо расхождение оценок K7 составляет 2 или более баллов
    if (
      Math.abs(
        this.firstFileCriterions['K7'] - this.secondFileCriterions['K7'],
      ) >= 2
    ) {
      this.decisionResult.decision = true;
    }

    //либо расхождение оценок K8 составляет 2 или более баллов
    if (
      Math.abs(
        this.firstFileCriterions['K8'] - this.secondFileCriterions['K8'],
      ) >= 2
    ) {
      this.decisionResult.decision = true;
    }

    return this.decisionResult;
  }
}
