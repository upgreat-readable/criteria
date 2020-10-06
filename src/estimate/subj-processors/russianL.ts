import {AbstractProcessor} from './abstractProcessor';
import * as constants from "../../support/constants";
import {Operations} from "../../support/operations";
import {russianMaxPoints} from "../../support/constants";
export class RussianL extends AbstractProcessor {
    criteria = {
        K1: 0,
        K2: 0,
        K3: 0,
        K4: 0,
        K5: 0,
        K6: 0,
        K7: 0,
        K8: 0,
        K9: 0,
        K10: 0,
        K11: 0,
        K12: 0
    }

    predefinedValues: string[] = [
        'ПРОБЛЕМА', 'ПРИМЕР', 'ПОЯСНЕНИЕ', 'СВЯЗЬ', 'ПОЗИЦИЯ', 'ОТНОШЕНИЕ',
        'П.проблема', 'П.факт',
        'П.опора', 'П.пересказ', 'П.факткомм', 'П.другая', 'П.копир',
        'П.позиция',
        'П.отнош', 'П.обоснов',
        'П.однообр', 'П.точность']

    shortTextFlag: number = 0

    /*
            если (объём < 70 слов) то K=К1=…=К12=0 и далее оценивание не производится;
            если (ПРОБЛЕМА>0) и (П.проблема=0) и (П.факт=0)  то К1=1;
            иначе К1=К2=К3=К4=0 и переход к вычислению К5–К12;
            если (П.опора+П.пересказ+П.факткомм+П.другая+П.копир>0) то К2=0;
            иначе если (ПРИМЕР>=2) и (ПОЯСНЕНИЕ>=2) и (СВЯЗЬ>=1) то К2=5;
            иначе если (ПРИМЕР>=2) и (ПОЯСНЕНИЕ+СВЯЗЬ>=2) то К2=4;
            иначе если (ПРИМЕР+ПОЯСНЕНИЕ+СВЯЗЬ>=3) то К2=3;
            иначе если (ПРИМЕР=2) то К2=2;
            иначе если (ПРИМЕР=1) то К2=1;
            иначе К2=0;
            если (ПОЗИЦИЯ>0) и (П.позиция=0) то К3=1 иначе К3=0;
            если (ОТНОШЕНИЕ>0) и (П.отнош+П.обоснов=0) то К4=1 иначе К4=0;
            КороткийТекст = [объём < 150 слов]
            К5 = max(2 – ошЛог, 0);
            К7 = max(0, округление_вниз(3 – 0.5*ошОрф – КороткийТекст));
            К8 = max(0, округление_вниз(3.5 – 0.5*ошПункт – КороткийТекст));
            К9 = max(0, округление_вниз(2 – 0.5*ошГрам – КороткийТекст));
            К10 = max(0, округление_вниз(2.5 – 0.5*ошРеч – КороткийТекст));
            К11 = [ошЭтич = 0];
            К12 = [ошФакт = 0];
            если (П.однообр+П.точность=0) и (K10>=2) то K6 = 2;
            иначе если (П.однообр+П.точность=1) или (K10<2) то K6 = 1;
            иначе К6=0;
            К = К1 + …. + К12. Максимальное значение К = 24.
     */
    analyze(): object {
        super.analyze()

        if (this.wordsCount < constants.russianWordsLowLimit) {
            return this.criteria
        }

        this.shortTextFlag = this.wordsCount < constants.russianShortTextCount ? 1 : 0

        this.setK1()
        if (this.criteria.K1 !== 0) {
            this.setK2()
            this.setK3()
            this.setK4()
        }
        this.setK5()
        this.setK7()
        this.setK8()
        this.setK9()
        this.setK10()
        this.setK11()
        this.setK12()

        this.setK6()

        if (Operations.objectSum(this.criteria) > russianMaxPoints) {
            throw new Error('Высчитанное количество баллов превысило максимально допустимое значение.')
        }

        return this.criteria
    }

    setK1 () : void {
        if (this.formattedEr['ПРОБЛЕМА'] > 0 && this.formattedEr['П.проблема'] === 0 && this.formattedEr['П.факт'] === 0) {
            this.criteria.K1 = 1
        }
    }

    setK2 () : void {
        if (this.formattedEr['П.опора'] + this.formattedEr['П.пересказ'] + this.formattedEr['П.факткомм'] + this.formattedEr['П.другая'] + this.formattedEr['П.копир'] > 0) {
            this.criteria.K2 = 0
        } else if (this.formattedEr['ПРИМЕР'] >= 2 && this.formattedEr['ПОЯСНЕНИЕ'] >= 2 && this.formattedEr['СВЯЗЬ'] >= 1) {
            this.criteria.K2 = 5
        } else if (this.formattedEr['ПРИМЕР'] >= 2 && (this.formattedEr['ПОЯСНЕНИЕ'] + this.formattedEr['СВЯЗЬ']) >= 2) {
            this.criteria.K2 = 4
        } else if (this.formattedEr['ПРИМЕР'] + this.formattedEr['ПОЯСНЕНИЕ'] + this.formattedEr['СВЯЗЬ'] >= 3) {
            this.criteria.K2 = 3
        } else if (this.formattedEr['ПРИМЕР'] === 2) {
            this.criteria.K2 = 2
        } else if (this.formattedEr['ПРИМЕР'] === 1) {
            this.criteria.K2 = 1
        } else {
            this.criteria.K2 = 0
        }
    }

    setK3 () : void {
        if (this.formattedEr['ПРИМЕР'] > 0 && this.formattedEr['П.позиция'] === 0) {
            this.criteria.K3 = 1
        } else {
            this.criteria.K3 = 0
        }
    }

    setK4 () : void {
        if (this.formattedEr['ОТНОШЕНИЕ'] > 0 && (this.formattedEr['П.отнош'] + this.formattedEr['П.обоснов'] === 0)) {
            this.criteria.K4 = 1
        } else {
            this.criteria.K4 = 0
        }
    }

    setK5 () : void {
        this.criteria.K5 = Math.max(2 - this.formattedEr['ошЛог'], 0)
    }

    setK6 () : void {
        if (this.formattedEr['П.однообр'] + this.formattedEr['П.точность'] === 0 && this.criteria.K10 >= 2) {
            this.criteria.K6 = 2
        } else if (this.formattedEr['П.однообр'] + this.formattedEr['П.точность'] === 1 || this.criteria.K10 < 2) {
            this.criteria.K6 = 1
        } else {
            this.criteria.K6 = 0
        }
    }

    setK7 () : void {
        // this.criteria.K7 = Math.max(0, Math.floor(3 - 0.5 * this.formattedEr['ошОрф']) - this.shortTextFlag)
        this.criteria.K7 = 3
    }

    setK8 () : void {
        // this.criteria.K8 = Math.max(0, Math.floor(3.5 - 0.5 * this.formattedEr['ошПункт'] - this.shortTextFlag))
        this.criteria.K8 = 3.5
    }

    setK9 () : void {
        this.criteria.K9 = Math.max(0, Math.floor(2 - 0.5 * this.formattedEr['ошГрам'] - this.shortTextFlag))
    }

    setK10 () : void {
        this.criteria.K10 = Math.max(0, Math.floor(2.5 - 0.5 * this.formattedEr['ошРеч'] - this.shortTextFlag))
    }

    setK11 () : void {
        this.criteria.K11 = this.formattedEr['ошЭтич'] === 0 ? 1 : 0
    }

    setK12 () : void {
        this.criteria.K12 = this.formattedEr['ошФакт'] === 0 ? 1 : 0
    }
}


