import { abstractDecision } from './abstractDecision';
import { thrdExpertDecision } from '../../interfaces/iSubjectDecision';

export class History extends abstractDecision {
  decide(): thrdExpertDecision {
    this.checkCriterionExists(['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7']);
    //расхождение итоговых оценок К двух экспертов составляет 5 или более баллов
    if (Math.abs(this.firstCritSum - this.secondCritSum) >= 5) {
      this.decisionResult.decision = true;
    }

    //либо расхождение по критерию K1 или К2 или К3 или К6 составляет 2 или более балла
    if (
      Math.abs(
        this.firstFileCriterions['K1'] - this.secondFileCriterions['K1'],
      ) === 2
    ) {
      this.decisionResult.decision = true;
    }
    if (
      Math.abs(
        this.firstFileCriterions['K2'] - this.secondFileCriterions['K2'],
      ) === 2
    ) {
      this.decisionResult.decision = true;
    }
    if (
      Math.abs(
        this.firstFileCriterions['K3'] - this.secondFileCriterions['K3'],
      ) === 2
    ) {
      this.decisionResult.decision = true;
    }
    if (
      Math.abs(
        this.firstFileCriterions['K6'] - this.secondFileCriterions['K6'],
      ) === 2
    ) {
      this.decisionResult.decision = true;
    }

    //либо расхождение по любым четырём или более критериям из семи
    let inc = 0;
    for (let i in this.firstFileCriterions) {
      if (
        Math.abs(this.firstFileCriterions[i] - this.secondFileCriterions[i])
      ) {
        inc++;
      }
    }
    if (inc >= 4) {
      this.decisionResult.decision = true;
    }

    return this.decisionResult;
  }
}
