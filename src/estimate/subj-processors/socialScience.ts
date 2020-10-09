import { AbstractProcessor } from './abstractProcessor';
import { Operations } from '../../support/operations';
import { socScienceMaxPoints } from '../../support/constants';

export class SocialScience extends AbstractProcessor {
  criteria = {
    K1: 0,
    K2: 0,
    K3: 0,
    K4: 0,
  };

  predefinedValues: string[] = [
    'идея',
    'понятие',
    'теория',
    'логика',
    'пример.общ',
    'пример.лич',
    'пример.ист',
    'о.смысл',
    'о.подмена',
    'о.пересказ',
    'о.понятие',
    'о.теория',
    'о.теорсвязь',
    'о.нехватает',
    'о.упрощ',
    'о.рассужд',
    'о.вывод',
    'о.примсвязь',
    'о.подтв',
    'о.дубл',
    'о.факт',
    'о.подробн',
  ];

  /*
        если (идея>0) и (о.смысл=0) и (о.подмена=0) и (о.пересказ=0) то К1=1;
        иначе К=К1=К2=К3=К4=0 и далее оценивание не производится;
        если (о.упрощ>0) то K2=0; иначе
        К2 = max(0, [понятие>0] + [теория>0] – [о.понятие+о.теория>0] – о.теорсвязь – о.нехватает);
        К3 = max(0, [логика>0] – о.рассужд – о.вывод);
        К4 = max(0, min(2, [пример.общ>1] + [пример.лич>1] + [пример.ист>1]) – о.примсвязь – о.подтв – о.дубл – о.факт – о.подробн);
        К = К1 + …. + К4. Максимальное значение К = 6.
     */

  analyze(): object {
    super.analyze();

    this.setK1();

    if (this.criteria.K1 === 0) {
      return this.criteria;
    }

    this.setK2();
    this.setK3();
    this.setK4();

    if (Operations.objectSum(this.criteria) > socScienceMaxPoints) {
      throw new Error(
        'Высчитанное количество баллов превысило максимально допустимое значение.',
      );
    }

    return this.criteria;
  }

  setK1(): void {
    if (
      this.formattedEr['идея'] > 0 &&
      this.formattedEr['о.смысл'] === 0 &&
      this.formattedEr['о.подмена'] === 0 &&
      this.formattedEr['о.пересказ'] === 0
    ) {
      this.criteria.K1 = 1;
    }
  }

  setK2(): void {
    if (this.formattedEr['о.упрощ'] > 0) {
      this.criteria.K2 = 0;
    } else {
      let conceptFlag = this.formattedEr['понятие'] > 0 ? 1 : 0;
      let theoryFlag = this.formattedEr['теория'] > 0 ? 1 : 0;
      let sumFlag =
        this.formattedEr['о.понятие'] + this.formattedEr['о.теория'] > 0
          ? 1
          : 0;

      this.criteria.K2 = Math.max(
        0,
        conceptFlag +
          theoryFlag -
          sumFlag -
          this.formattedEr['о.теорсвязь'] -
          this.formattedEr['о.нехватает'],
      );
    }
  }

  setK3(): void {
    let logicFlag = this.formattedEr['логика'] > 0 ? 1 : 0;
    this.criteria.K3 = Math.max(
      0,
      logicFlag - this.formattedEr['о.рассужд'] - this.formattedEr['о.вывод'],
    );
  }

  setK4(): void {
    let exSoc = this.formattedEr['пример.общ'] > 1 ? 1 : 0;
    let exPerson = this.formattedEr['пример.лич'] > 1 ? 1 : 0;
    let exHist = this.formattedEr['пример.ист'] > 1 ? 1 : 0;

    this.criteria.K4 = Math.max(
      0,
      Math.min(2, exSoc + exPerson + exHist) -
        this.formattedEr['о.примсвязь'] -
        this.formattedEr['о.подтв'] -
        this.formattedEr['о.дубл'] -
        this.formattedEr['о.факт'] -
        this.formattedEr['о.подробн'],
    );
  }
}
