import { AbstractProcessor } from './abstractProcessor';
import { Operations } from '../../support/operations';

export class EnglishL extends AbstractProcessor {
  criteria = {
    K1: 0,
    K2: 0,
    K3: 0,
    K4: 0,
    K5: 0,
  };

  predefinedValues: string[] = [
    'проблема',
    'лмнение',
    'прмнение',
    'аргумент',
    'обоснование',
    'вывод',
    'а.стиль',
    'а.перифр',
    'а.пробл',
    'а.аспект',
    'а.аспм',
    'а.факт',
    'а.объем',
    'а.непрод',
    'а.логика',
    'а.связь',
    'а.абзац',
    'а.лекс',
    'а.запас',
    'а.грамм',
    'а.уров',
    'а.орф',
    'а.пункт',
  ];

  oshPlanErrorsCount: number = 0;

  /*

              ошАспекты = [ЛМНЕНИЕ=0] + [ПРМНЕНИЕ=0] + max(3 – ДОВОД, 0) + [ОБОСНОВАНИЕ=0];
              если (А.объем<200 слов) или (А.непрод>30% слов) то К1 = 0;
              иначе если (ошАспекты=0) и (А.аспект=0) и (А.стиль<=1) то К1 = 3;
              иначе если (ошАспекты=0) и (А.аспект<=2) и (А.стиль<=3), то К1 = 2;
              иначе если (ошАспекты*2+А.аспект<=4) и (А.стиль<=4), то К1 = 1;
              иначе К1 = 0;
              если (К1 = 0), то К = 0 и остальные критерии не вычисляем;
              @todo необходимо, чтобы ДОВОД-ы ЛМНЕНИЯ имели одинаковые теги с ЛМНЕНИЕ, равно как и ДОВОД-ы ПРМНЕНИЕ с ПРМНЕНИЕ
              @todo - уточнить - блоки значения ошПлан следуют один за другим и не могут быть вложены друг в друга?
              ошПлан = число блоков, отсутствующих или нарушающих порядок следования в последовательности {ПРОБЛЕМА, ЛМНЕНИЕ, {ДОВОД-ы, относящиеся к ЛМНЕНИЕ}, ПРМНЕНИЕ, {ДОВОД-ы, относящиеся к ПРМНЕНИЕ}, ОБОСНОВАНИЕ, ВЫВОД};
              если (ошПлан=0) и (А.логика=0) и (А.нсвязь=0) и (А.связь=0) и (А.абзац=0) то К2 = 3;
              иначе если (ошПлан + А.логика + А.нсвязь + А.абзац<=4) и (А.связь=0) то К2 = 2;
              иначе если (ошПлан + А.логика + А.связь + А.абзац<=8) то К2 = 1;
              иначе К2 = 0;
              если (А.лексика<=1) и (А.запас=0) то К3 = 3;
              иначе если (А.лексика+3*А.запас<=3) то К3 = 2;
              иначе если (А.лексика<=4) и (А.запас<=1) то К3 = 1;
              иначе К3 = 0;

              если (А.грамм<=2) и (А.уровень=0) и (А.несоотв=0) то К4 = 3;
              иначе если (А.грамм<=4) и (А.уровень=0) и (А.несоотв=0) то К4 = 2;
              иначе если (А.грамм<=7) и (А.уровень=0) и (А.несоотв<=1) то К4 = 1;
              иначе К4 = 0;

              если (А.орф<=1) и (А.пункт<=1) то К5 = 2;
              иначе если (А.орф+А.пункт<=4) то К5 = 1;
              иначе К5 = 0;
              итоговая оценка K = К1 + К2 + К3 + К4 + К5  (максимальное значение К=14).
           */
  analyze(): any {
    //считаем количество ошПлан
    this.setOshErrors();
    super.analyze();

    this.setK1();

    if (this.criteria.K1 === 0) {
      return this.criteria;
    }

    this.setK2();
    this.setK3();
    this.setK4();
    this.setK5();

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
    let oshAspects = this.setOshAspects();

    let unproductivePercent = this.setUnproductivePercent();

    if (this.wordsCount < 180 || unproductivePercent > 30) {
      this.criteria.K1 = 0;
    } else if (
      oshAspects === 0 &&
      this.formattedEr['а.аспект'] === 0 &&
      this.formattedEr['а.стиль'] <= 1
    ) {
      this.criteria.K1 = 3;
    } else if (
      oshAspects === 0 &&
      this.formattedEr['а.аспект'] <= 2 &&
      this.formattedEr['а.стиль'] <= 3
    ) {
      this.criteria.K1 = 2;
    } else if (
      oshAspects * 2 + this.formattedEr['а.аспект'] <= 4 &&
      this.formattedEr['а.стиль'] <= 4
    ) {
      this.criteria.K1 = 1;
    } else {
      this.criteria.K1 = 0;
    }
  }

  setK2(): void {

    if (
      this.oshPlanErrorsCount === 0 &&
      this.formattedEr['а.логика'] === 0 &&
      this.formattedEr['а.связь'] === 0 &&
      this.formattedEr['а.абзац'] === 0
    ) {
      this.criteria.K2 = 3;
    } else if (
      Operations.sum(
        this.oshPlanErrorsCount,
        this.formattedEr['а.логика'],
        this.formattedEr['а.связь'],
        this.formattedEr['а.абзац'],
      ) <= 4
    ) {
      this.criteria.K2 = 2;
    } else if (
      Operations.sum(
        this.oshPlanErrorsCount,
        this.formattedEr['а.логика'],
        this.formattedEr['а.связь'],
        this.formattedEr['а.абзац'],
      ) <= 8
    ) {
      this.criteria.K2 = 1;
    } else {
      this.criteria.K2 = 0;
    }
  }

  setK3(): void {
    if (this.formattedEr['а.лекс'] <= 1 && this.formattedEr['а.запас'] === 0) {
      this.criteria.K3 = 3;
    } else if (
      this.formattedEr['а.лекс'] + 3 * this.formattedEr['а.запас'] <=
      3
    ) {
      this.criteria.K3 = 2;
    } else if (
      this.formattedEr['а.лекс'] <= 4 &&
      this.formattedEr['а.запас'] <= 1
    ) {
      this.criteria.K3 = 1;
    } else {
      this.criteria.K3 = 0;
    }
  }

  setK4(): void {
    if (this.formattedEr['а.грамм'] <= 2 && this.formattedEr['а.уров'] === 0) {
      this.criteria.K4 = 3;
    } else if (
      this.formattedEr['а.грамм'] <= 4 &&
      this.formattedEr['а.уров'] === 0
    ) {
      this.criteria.K4 = 2;
    } else if (
      this.formattedEr['а.грамм'] <= 7 &&
      this.formattedEr['а.уров'] <= 1
    ) {
      this.criteria.K4 = 1;
    } else {
      this.criteria.K4 = 0;
    }
  }

  setK5(): void {
    if (this.formattedEr['а.орф'] <= 1 && this.formattedEr['а.пункт'] <= 1) {
      this.criteria.K5 = 2;
    } else if (this.formattedEr['а.орф'] + this.formattedEr['а.пункт'] <= 4) {
      this.criteria.K5 = 1;
    } else {
      this.criteria.K5 = 0;
    }
  }

  setUnproductivePercent(): number {
    let resultPercent: number = 0;
    let upProdWordsCount: number = 0;
    let totalWordsCount: number = Operations.countWords(this.markUpData.text);
    for (let i in this.markUpData.selections) {
      if (this.markUpData.selections[i].type.toLocaleLowerCase() === 'а.непрод') {
        upProdWordsCount += Operations.countWords(
          this.markUpData.text.substring(
            this.markUpData.selections[i].startSelection,
            this.markUpData.selections[i].endSelection,
          ),
        );
      }
    }

    if (upProdWordsCount !== 0) {
      resultPercent = (upProdWordsCount / totalWordsCount) * 100;
      return Math.round(resultPercent);
    }

    return resultPercent;
  }

  setOshAspects(): number {
    let param1 =
      this.formattedEr['проблема'] === 0 ||
      this.formattedEr['а.перифр'] > 0 ||
      this.formattedEr['а.пробл'] > 0
        ? 1
        : 0;
    let param2 = this.formattedEr['лмнение'] === 0 ? 1 : 0;
    let param3 = this.formattedEr['прмнение'] === 0 ? 1 : 0;
    let param4 = Math.max(3 - this.formattedEr['аргумент'], 0);
    let param5 = this.formattedEr['обоснование'] === 0 ? 1 : 0;

    return param1 + param2 + param3 + param4 + param5;
  }

  setOshErrors() {
    let oshHelp: { code: string; start: number; end: number }[] = [
      {
        code: 'проблема',
        start: 1000000,
        end: 1000000,
      },
      {
        code: 'лмнение',
        start: 1000001,
        end: 1000001,
      },
      {
        code: 'прмнение',
        start: 1000002,
        end: 1000002,
      },
      {
        code: 'обоснование',
        start: 1000003,
        end: 1000003,
      },
      {
        code: 'вывод',
        start: 1000004,
        end: 1000004,
      },
    ];

    //установим координаты смысловых блоков, участвующих в расчёте ОшПлан
    for (let i in this.markUpData.selections) {
      for (let q in oshHelp) {
        if (oshHelp[q].code === this.markUpData.selections[i].type.toLocaleLowerCase()) {
          oshHelp[q].start = this.markUpData.selections[i].startSelection;
          oshHelp[q].end = this.markUpData.selections[i].endSelection;
        }
      }
    }

    let errorsCount: number = 0;
    oshHelp.forEach(function (item, key, array) {
      //для отсутствующих элементов просто увеличиваем число ошибок
      if (array[key].start >= 1000000 && array[key].end >= 1000000) {
        errorsCount++;
        return;
      }

      //для элементов посреди ряда - проверяем на обнуление следующий и высчитываем положение
      if (key !== array.length - 1) {
        if (
          array[key + 1].start < 100000 &&
          array[key + 1].end < 100000 &&
          array[key].start > array[key + 1].start &&
          array[key + 1].end < array[key].end
        ) {
          errorsCount++;
        }
      } else {
        //для последнего элемента установим факт обнуления предыдущего = последний элемент не на своем месте
        if (array[key - 1].start >= 100000 && array[key - 1].end >= 100000) {
          errorsCount++;
        }
      }
    });

    this.oshPlanErrorsCount = errorsCount;
  }
}
