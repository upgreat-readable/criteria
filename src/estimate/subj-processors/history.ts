import { AbstractProcessor } from './abstractProcessor';
import { Operations } from '../../support/operations';
import { historyMaxPoints } from '../../support/constants';

export class History extends AbstractProcessor {
  criteria = {
    K1: 0,
    K2: 0,
    K3: 0,
    K4: 0,
    K5: 0,
    K6: 0,
    K7: 0,
  };

  predefinedValues: string[] = [
    'событие',
    'сяп',
    'роль',
    'причина',
    'следствие',
    'оценка',
    'и.событие',
    'и.сяп',
    'и.период',
    'и.личность',
    'и.лсвязь',
    'и.лпериод',
    'и.лроль',
    'и.лдейств',
    'и.причин',
    'и.следств',
    'и.влиян',
    'и.упрощ',
    'и.понятие',
    'и.неиспол',
    'и.факт',
    'и.излож',
  ];

  roles = [
    {
      roleId: 1,
      code: 'роль',
      tag: '',
      count: 0,
      elems: {
        'и.личность': 0,
        'и.лсвязь': 0,
        'и.лпериод': 0,
        'и.лроль': 0,
        'и.лдейств': 0,
      },
    },
    {
      roleId: 2,
      code: 'роль',
      tag: '',
      count: 0,
      elems: {
        'и.личность': 0,
        'и.лсвязь': 0,
        'и.лпериод': 0,
        'и.лроль': 0,
        'и.лдейств': 0,
      },
    },
  ];

  reasonConsequence = [
    {
      rcId: 1,
      rcIdTag: '',
      reason: 0,
      consequence: 0,
      elems: {
        'и.причин': 0,
        'и.следств': 0,
      },
    },
    {
      rcId: 2,
      rcIdTag: '',
      reason: 0,
      consequence: 0,
      elems: {
        'и.причин': 0,
        'и.следств': 0,
      },
    },
  ];

  /*
        К1 = max(0, min(2, сяп – и.сяп – и.период));
        если (К1=0) то К=К1=…=К7=0 и далее оценивание не производится;
        выделяются две совокупности фрагментов, описывающих две исторические личности:
        Личн1 = [роль1>0] – [и.личность1 + и.лсвязь1 + и.лпериод1 + и.лроль1 + и.лдейств1 >0];
        Личн2 = [роль2>0] – [и.личность2 + и.лсвязь2 + и.лпериод2 + и.лроль2 + и.лдейств2 >0];
        К2 = Личн1 + Личн2;
        выделяются две пары фрагментов, описывающих две причинно-следственные связи:
        ПСС1 = [причина1>0 и следствие1>0] – [и.причин1 + и.следств1 >0];
        ПСС2 = [причина2>0 и следствие2>0] – [и.причин2 + и.следств2 >0];
        К3 = ПСС1 + ПСС2;
        K4 = [оценка>0] – [и.влиян + и.упрощ>0];
        K5 = 1 – [и.понятие + и.неиспол >0];
        К6 = max(0, 3 – и.факт);
        если (К1+К2+К3+К4<5) то К7 = 0;
        иначе К7 = [и.излож=0 и К1+К2+К3+К4>=5];
        К = К1 + …. + К7. Максимальное значение К = 12.
     */
  analyze(): any {
    this.fillBasicRoleFragments();

    super.analyze();

    this.setK1();

    if (this.criteria.K1 === 0) {
      return this.criteria;
    }

    this.setK2();
    this.setK3();
    this.setK4();
    this.setK5();
    this.setK6();
    this.setK7();

    if (Operations.objectSum(this.criteria) > historyMaxPoints) {
      throw new Error(
        'Высчитанное количество баллов превысило максимально допустимое значение.',
      );
    }

    return this.criteria;
  }

  setK1(): void {
    this.criteria.K1 = Math.max(
      0,
      Math.min(
        2,
        Operations.diff(
          this.formattedEr['сяп'],
          this.formattedEr['и.сяп'],
          this.formattedEr['и.период'],
        ),
      ),
    );
  }

  setK2(): void {
    let sum1 = Operations.sum(
      this.roles[0].elems['и.личность'],
      this.roles[0].elems['и.лсвязь'],
      this.roles[0].elems['и.лпериод'],
      this.roles[0].elems['и.лроль'],
      this.roles[0].elems['и.лдейств'],
    );
    let factor1 = sum1 > 0 ? 1 : 0;

    let sum2 = Operations.sum(
      this.roles[1].elems['и.личность'],
      this.roles[1].elems['и.лсвязь'],
      this.roles[1].elems['и.лпериод'],
      this.roles[1].elems['и.лроль'],
      this.roles[1].elems['и.лдейств'],
    );
    let factor2 = sum2 > 0 ? 1 : 0;

    let person1 = Operations.diff(this.roles[0].count, factor1);
    let person2 = Operations.diff(this.roles[1].count, factor2);

    this.criteria.K2 = Operations.sum(person1, person2);
  }

  //@todo оптимизировать через foreach определение двух параметров в ряду
  setK3(): void {
    let param1: number;
    if (
      this.reasonConsequence[0].reason > 0 &&
      this.reasonConsequence[0].consequence > 0
    ) {
      param1 = 1;
    } else {
      param1 = 0;
    }

    let sumToParam2 = Operations.sum(
      this.reasonConsequence[0].elems['и.причин'],
      this.reasonConsequence[0].elems['и.следств'],
    );
    let param2 = sumToParam2 > 0 ? 1 : 0;

    let pss1 = param1 + param2;

    let param3: number;
    if (
      this.reasonConsequence[1].reason > 0 &&
      this.reasonConsequence[1].consequence > 0
    ) {
      param3 = 1;
    } else {
      param3 = 0;
    }

    let sumToParam4 = Operations.sum(
      this.reasonConsequence[1].elems['и.причин'],
      this.reasonConsequence[1].elems['и.следств'],
    );
    let param4 = sumToParam4 > 0 ? 1 : 0;

    let pss2 = param3 + param4;

    this.criteria.K3 = pss1 + pss2;
  }

  setK4(): void {
    let rating = this.formattedEr['оценка'] > 0 ? 1 : 0;

    let sumToParam2 = Operations.sum(
      this.formattedEr['и.влиян'],
      this.formattedEr['и.упрощ'],
    );
    let param2 = sumToParam2 > 0 ? 1 : 0;

    this.criteria.K4 = Operations.diff(rating, param2);
  }

  setK5(): void {
    let sumToParam = Operations.sum(
      this.formattedEr['и.понятие'],
      this.formattedEr['и.неиспол'],
    );
    let param = sumToParam > 0 ? 1 : 0;

    this.criteria.K5 = Operations.diff(1, param);
  }

  setK6(): void {
    this.criteria.K6 = Math.max(0, 3 - this.formattedEr['и.факт']);
  }

  setK7(): void {
    if (
      Operations.sum(
        this.criteria.K1,
        this.criteria.K2,
        this.criteria.K3,
        this.criteria.K4,
      ) < 5
    ) {
      this.criteria.K7 = 0;
    } else {
      let param1 = this.formattedEr['и.излож'] === 0 ? 1 : 0;
      let param2 =
        Operations.sum(
          this.criteria.K1,
          this.criteria.K2,
          this.criteria.K3,
          this.criteria.K4,
        ) >= 5;
      if (param1 && param2) {
        this.criteria.K7 = 1;
      } else {
        this.criteria.K7 = 0;
      }
    }
  }

  fillBasicRoleFragments(): void {
    let incR: number = 0;
    let incP: number = 0;
    let incS: number = 0;

    for (let i in this.markUpData.selections) {
      switch (this.markUpData.selections[i].type) {
        case 'роль':
          this.fillTheFirstTwoRoles(incR, this.markUpData.selections[i])
            ? incR++
            : '';
          break;
        case 'причина':
          this.fillTheFirstTwoReason(incP, this.markUpData.selections[i])
            ? incP++
            : '';
          break;
        case 'следствие':
          this.fillTheFirstTwoConsequence(incS, this.markUpData.selections[i])
            ? incS++
            : '';
          break;
      }
    }

    this.setRoleFragmentVariables([0, 1]);
    this.setRcFragmentVariables([0, 1]);
  }

  /*
    @method fillTheFirstTwoRoles, fillTheFirstTwoReason, fillTheFirstTwoConsequence
    работает только с первыми двумя, встреченными итеративно элементами
     */
  fillTheFirstTwoRoles(inc: number, selection: any): boolean {
    if ([0, 1].includes(inc)) {
      this.roles[inc].count = 1;
      this.roles[inc].tag = selection.tag;
      return true;
    }
    return false;
  }

  fillTheFirstTwoReason(inc: number, selection: any): boolean {
    if ([0, 1].includes(inc)) {
      this.reasonConsequence[inc].reason = 1;
      this.reasonConsequence[inc].rcIdTag = selection.tag;
      return true;
    }
    return false;
  }

  fillTheFirstTwoConsequence(inc: number, selection: any): boolean {
    if ([0, 1].includes(inc)) {
      this.reasonConsequence[inc].consequence = 1;
      return true;
    }
    return false;
  }

  setRoleFragmentVariables(arRoleIndex = [0, 1]): void {
    for (let roleIndex of arRoleIndex) {
      let roleTag = this.roles[roleIndex].tag;
      let roleElems: any = this.roles[roleIndex].elems;

      for (let k in this.markUpData.selections) {
        let curCode: string = this.markUpData.selections[k].type;
        let curTag: string = this.markUpData.selections[k].tag;
        if (roleElems.hasOwnProperty(curCode) && curTag === roleTag) {
          roleElems[curCode] = roleElems[curCode] + 1;
        }
      }

      this.roles[roleIndex].elems = roleElems;
    }
  }

  setRcFragmentVariables(arRoleIndex = [0, 1]): void {
    for (let roleIndex of arRoleIndex) {
      let roleTag = this.reasonConsequence[roleIndex].rcIdTag;
      let roleElems: any = this.reasonConsequence[roleIndex].elems;

      for (let k in this.markUpData.selections) {
        let curCode: string = this.markUpData.selections[k].type;
        let curTag: string = this.markUpData.selections[k].tag;
        if (roleElems.hasOwnProperty(curCode) && curTag === roleTag) {
          roleElems[curCode] = roleElems[curCode] + 1;
        }
      }

      this.reasonConsequence[roleIndex].elems = roleElems;
    }
  }
}
