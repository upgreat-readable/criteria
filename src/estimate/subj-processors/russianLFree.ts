import { AbstractProcessor } from './abstractProcessor';
import { Operations } from '../../support/operations';
import { russianFreeMaxPoints } from '../../support/constants';

export class RussianLFree extends AbstractProcessor {
  criteria = {
    K1: 0,
    K2: 0,
    K3: 0,
    K4: 0,
    K5: 0,
    K6: 0,
    K7: 0,
  };

  /**
     ошГрам = число грамматических ошибок согласно разделу 2.1;
     ошРеч = число речевых ошибок согласно разделу 2.2;
     ошЛог = число логических ошибок согласно разделу 2.3;
     ошФакт = число фактических ошибок согласно разделу 2.4;
     ошЭтич = число этических ошибок согласно разделу 2.5;
     ошОрф = число орфографических ошибок (равно нулю в рамках Конкурса);
     ошПункт = число пунктуационных ошибок (равно нулю в рамках Конкурса);
     К1 = max(4 – ошГрам, 0);
     К2 = max(4 – ошРеч, 0);
     К3 = max(4 – ошЛог, 0);
     К4 = max(3 – ошФакт, 0);
     К5 = max(3 – ошЭтич, 0);
     К6 = max(0, округление_вниз(3 – 0.5*ошОрф));
     К7 = max(0, округление_вниз(3.5 – 0.5*ошПункт));
     К = К1 + …. + К7. Максимальное значение К = 24.
     */
  analyze(): object {
    super.analyze();

    this.setK1();
    this.setK2();
    this.setK3();
    this.setK4();
    this.setK5();
    this.setK6();
    this.setK7();

    if (Operations.objectSum(this.criteria) > russianFreeMaxPoints) {
      throw new Error(
        'Высчитанное количество баллов превысило максимально допустимое значение.',
      );
    }

    return this.criteria;
  }

  setK1(): void {
    this.criteria.K1 = Math.max(4 - this.formattedEr['ошграм'], 0);
  }

  setK2(): void {
    this.criteria.K2 = Math.max(4 - this.formattedEr['ошреч'], 0);
  }

  setK3(): void {
    this.criteria.K3 = Math.max(4 - this.formattedEr['ошлог'], 0);
  }

  setK4(): void {
    this.criteria.K4 = Math.max(3 - this.formattedEr['ошфакт'], 0);
  }

  setK5(): void {
    this.criteria.K5 = Math.max(3 - this.formattedEr['ошэтич'], 0);
  }

  setK6(): void {
    // this.criteria.K6 = Math.max(
    //   0,
    //   Math.floor(3 - 0.5 * this.formattedEr['ошорф']),
    // );
    this.criteria.K6 = Math.max(0, Math.floor(3));
  }

  setK7(): void {
    // this.criteria.K7 = Math.max(
    //   0,
    //   Math.floor(3.5 - 0.5 * this.formattedEr['ошорф']),
    // );
    this.criteria.K7 = Math.max(0, Math.floor(3.5));
  }
}
