import {AbstractProcessor} from "./abstractProcessor";
import * as constants from "../../support/constants";
import {Operations} from "../../support/operations";
import {literatureMaxPoints} from "../../support/constants";

export class Literature extends AbstractProcessor {
    criteria = {
        K1: 0,
        K2: 0,
        K3: 0,
        K4: 0,
        K5: 0
    }

    predefinedValues: string[] = [
        'АРГУМЕНТ', 'ПОНЯТИЕ',
        'С.одностор', 'С.поверхн', 'С.тема',
        'С.опора', 'С.упрощен', 'С.пересказ', 'С.позиция', 'С.факт',
        'С.понятие', 'С.неиспол',
        'С.послед', 'С.неразв', 'С.связь', 'С.композ'
    ]

    /*
        если (объём < 150 слов) то K=К1=…=К5=0 и далее оценивание не производится;
        если (С.тема>0) то К1=0;
        иначе если (С.поверхн>0) то К1=1;
        иначе если (С.одностор>0) то К1=2;
        иначе К1=3;
        если (АРГУМЕНТ=0) или (С.опора>0) или (С.позиция>0) или (С.факт>=4) то К2=0;
        иначе если (С.упрощен>0) или (С.пересказ>0) или (С.факт>=3) то К2=1;
        иначе если (С.факт>=2) то К2=2;
        иначе если (С.факт=0) то К2=3;
        если (ПОНЯТИЕ=0) или (С.понятие>=2) то К3=0;
        иначе если (С.неиспол>0) или (С.понятие>=1) то К3=1;
        иначе К3=2;
        если (С.композ>0) то К4=0;
        иначе если (С.неразв>0) или (С.связь>0) то К4=1;
        иначе если (С.послед>0) то К4=2;
        иначе К4=3;
        ошРеч = число речевых ошибок согласно разделу 2.2;
        К5 = max(0, округление_вниз(3.5 – 0.5*ошРеч));
        К = К1 + …. + К5. Максимальное значение К = 14.
     */

    analyze(): object {
        super.analyze()

        if (this.wordsCount < constants.literatureWordsLowLimit) {
            return this.criteria
        }

        this.setK1()
        this.setK2()
        this.setK3()
        this.setK4()
        this.setK5()

        if (Operations.objectSum(this.criteria) > literatureMaxPoints) {
            throw new Error('Высчитанное количество баллов превысило максимально допустимое значение.')
        }

        return this.criteria
    }

    setK1 () : void {
        if (this.formattedEr['С.тема'] > 0) {
            this.criteria.K1 = 0
        } else if (this.formattedEr['С.поверхн'] > 0) {
            this.criteria.K1 = 1
        } else if (this.formattedEr['С.одностор'] > 0) {
            this.criteria.K1 = 2
        } else {
            this.criteria.K1 = 3
        }
    }

    setK2 () : void {
        if (this.formattedEr['АРГУМЕНТ'] === 0 || this.formattedEr['С.опора'] > 0 || this.formattedEr['С.позиция'] > 0 || this.formattedEr['С.факт'] >= 4) {
            this.criteria.K2 = 0
        } else if (this.formattedEr['С.упрощен'] > 0 || this.formattedEr['С.пересказ'] > 0 || this.formattedEr['С.факт'] >= 3) {
            this.criteria.K2 = 1
        } else if (this.formattedEr['С.факт'] >= 2) {
            this.criteria.K2 = 2
        } else if (this.formattedEr['С.факт'] === 0) {
            this.criteria.K2 = 3
        }
    }

    setK3 () : void {
        if (this.formattedEr['ПОНЯТИЕ'] === 0 || this.formattedEr['С.понятие'] >= 2) {
            this.criteria.K3 = 0
        } else if (this.formattedEr['С.неиспол'] > 0 || this.formattedEr['С.понятие'] >= 1) {
            this.criteria.K3 = 1
        } else {
            this.criteria.K3 = 2
        }
    }

    setK4 () : void {
        if (this.formattedEr['С.композ'] > 0) {
            this.criteria.K4 = 0
        } else if (this.formattedEr['С.неразв'] > 0 || this.formattedEr['С.связь'] > 0) {
            this.criteria.K4 = 1
        } else if (this.formattedEr['С.послед'] > 0) {
            this.criteria.K4 = 2
        } else {
            this.criteria.K4 = 3
        }
    }

    setK5 () : void {
        this.criteria.K5 = Math.max(0, Math.floor(3.5 - 0.5 * this.formattedEr['ошРеч']))
    }
}
