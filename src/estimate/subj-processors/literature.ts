import { AbstractProcessor } from './abstractProcessor';
import * as constants from '../../support/constants';
import { Operations } from '../../support/operations';
import { literatureMaxPoints } from '../../support/constants';

export class Literature extends AbstractProcessor {
  criteria = {
    K1: 0,
    K2: 0,
    K3: 0,
    K4: 0,
    K5: 0,
  };

  predefinedValues: string[] = [
    'аргумент',
    'понятие',
    'с.одностор',
    'с.поверхн',
    'с.тема',
    'с.опора',
    'с.упрощен',
    'с.пересказ',
    'с.позиция',
    'с.факт',
    'с.понятие',
    'с.неиспол',
    'с.послед',
    'с.неразв',
    'с.связь',
    'с.композ',
  ];

  /*
          если (объём < 150 слов) то K=К1=…=К5=0 и далее оценивание не производится;
          если (с.тема>0) то К1=0;
          иначе если (с.поверхн>0) то К1=1;
          иначе если (с.одностор>0) то К1=2;
          иначе К1=3;
          если (аргумент=0) или (с.опора>0) или (с.позиция>0) или (с.факт>=4) то К2=0;
          иначе если (с.упрощен>0) или (с.пересказ>0) или (с.факт>=3) то К2=1;
          иначе если (с.факт>=2) то К2=2;
          иначе если (с.факт=0) то К2=3;
          если (понятие=0) или (с.понятие>=2) то К3=0;
          иначе если (с.неиспол>0) или (с.понятие>=1) то К3=1;
          иначе К3=2;
          если (с.композ>0) то К4=0;
          иначе если (с.неразв>0) или (с.связь>0) то К4=1;
          иначе если (с.послед>0) то К4=2;
          иначе К4=3;
          ошРеч = число речевых ошибок согласно разделу 2.2;
          К5 = max(0, округление_вниз(3.5 – 0.5*ошРеч));
          К = К1 + …. + К5. Максимальное значение К = 14.
       */

  analyze(): object {
    super.analyze();

    if (this.webMode) {
      if (this.wordsCount < constants.literatureWordsLowLimit) {
        return this.criteria;
      }
    }

    this.setK1();
    this.setK2();
    this.setK3();
    this.setK4();
    this.setK5();

    if (Operations.objectSum(this.criteria) > literatureMaxPoints) {
      throw new Error(
        'Высчитанное количество баллов превысило максимально допустимое значение.',
      );
    }

    for (let i in this.criteria) {
      // @ts-ignore
      if (this.criteria[i] < 0) {
        // @ts-ignore
        this.criteria[i] = 0;
      }
    }

    return this.criteria;
  }

  setK1(): void {
    if (this.formattedEr['с.тема'] > 0) {
      this.criteria.K1 = 0;
    } else if (this.formattedEr['с.поверхн'] > 0) {
      this.criteria.K1 = 1;
    } else if (this.formattedEr['с.одностор'] > 0) {
      this.criteria.K1 = 2;
    } else {
      this.criteria.K1 = 3;
    }
  }

  setK2(): void {
    if (
      this.formattedEr['аргумент'] === 0 ||
      this.formattedEr['с.опора'] > 0 ||
      this.formattedEr['с.позиция'] > 0 ||
      this.formattedEr['с.факт'] >= 4
    ) {
      this.criteria.K2 = 0;
    } else if (
      this.formattedEr['с.упрощен'] > 0 ||
      this.formattedEr['с.пересказ'] > 0 ||
      this.formattedEr['с.факт'] >= 3
    ) {
      this.criteria.K2 = 1;
    } else if (this.formattedEr['с.факт'] >= 2) {
      this.criteria.K2 = 2;
    } else if (this.formattedEr['с.факт'] === 0) {
      this.criteria.K2 = 3;
    }
  }

  setK3(): void {
    if (
      this.formattedEr['понятие'] === 0 ||
      this.formattedEr['с.понятие'] >= 2
    ) {
      this.criteria.K3 = 0;
    } else if (
      this.formattedEr['с.неиспол'] > 0 ||
      this.formattedEr['с.понятие'] >= 1
    ) {
      this.criteria.K3 = 1;
    } else {
      this.criteria.K3 = 2;
    }
  }

  setK4(): void {
    if (this.formattedEr['с.композ'] > 0) {
      this.criteria.K4 = 0;
    } else if (
      this.formattedEr['с.неразв'] > 0 ||
      this.formattedEr['с.связь'] > 0
    ) {
      this.criteria.K4 = 1;
    } else if (this.formattedEr['с.послед'] > 0) {
      this.criteria.K4 = 2;
    } else {
      this.criteria.K4 = 3;
    }
  }

  setK5(): void {
    this.criteria.K5 = Math.max(
      0,
      Math.floor(3.5 - 0.5 * this.formattedEr['ошреч']),
    );
  }
}
