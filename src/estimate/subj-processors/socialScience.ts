import {AbstractProcessor} from "./abstractProcessor";
import {Operations} from "../../support/operations";
import {socScienceMaxPoints} from "../../support/constants";

export class SocialScience extends AbstractProcessor {
    criterions = {
        K1: 0,
        K2: 0,
        K3: 0,
        K4: 0
    }

    predefinedValues: string[] = [
        'ИДЕЯ', 'ПОНЯТИЕ', 'ТЕОРИЯ', 'ЛОГИКА', 'ПРИМЕР.ОБЩ', 'ПРИМЕР.ЛИЧ', 'ПРИМЕР.ИСТ',
        'о.смысл', 'о.подмена', 'о.пересказ',
        'о.понятие', 'о.теория', 'о.теорсвязь', 'о.нехватает', 'о.упрощ',
        'о.рассужд', 'о.вывод',
        'о.примсвязь', 'о.подтв', 'о.дубл', 'о.факт', 'о.подробн'
    ]

    /*
        если (ИДЕЯ>0) и (о.смысл=0) и (о.подмена=0) и (о.пересказ=0) то К1=1;
        иначе К=К1=К2=К3=К4=0 и далее оценивание не производится;
        если (о.упрощ>0) то K2=0; иначе
        К2 = max(0, [ПОНЯТИЕ>0] + [ТЕОРИЯ>0] – [о.понятие+о.теория>0] – о.теорсвязь – о.нехватает);
        К3 = max(0, [ЛОГИКА>0] – о.рассужд – о.вывод);
        К4 = max(0, min(2, [ПРИМЕР.ОБЩ>1] + [ПРИМЕР.ЛИЧ>1] + [ПРИМЕР.ИСТ>1]) – о.примсвязь – о.подтв – о.дубл – о.факт – о.подробн);
        К = К1 + …. + К4. Максимальное значение К = 6.
     */

    analyze(): object {
        super.analyze()

        this.setK1()


        if (this.criterions.K1 === 0) {
            return this.criterions
        }

        this.setK2()
        this.setK3()
        this.setK4()

        if (Operations.objectSum(this.criterions) > socScienceMaxPoints) {
            throw new Error('Высчитанное количество баллов превысило максимально допустимое значение.')
        }

        return this.criterions
    }

    setK1(): void {
        if (this.formattedEr['ИДЕЯ'] > 0 && this.formattedEr['о.смысл'] === 0 && this.formattedEr['о.подмена'] === 0 && this.formattedEr['о.пересказ'] === 0) {
            this.criterions.K1 = 1
        }
    }

    setK2(): void {
        if (this.formattedEr['о.упрощ'] > 0) {
            this.criterions.K2 = 0
        } else {
            let conceptFlag = this.formattedEr['ПОНЯТИЕ'] > 0 ? 1 : 0
            let theoryFlag = this.formattedEr['ТЕОРИЯ'] > 0 ? 1 : 0
            let sumFlag = (this.formattedEr['о.понятие'] + this.formattedEr['о.теория']) > 0 ? 1 : 0

            this.criterions.K2 = Math.max(0, (conceptFlag + theoryFlag - sumFlag - this.formattedEr['о.теорсвязь'] - this.formattedEr['о.нехватает']))
        }
    }

    setK3(): void {
        let logicFlag = this.formattedEr['ЛОГИКА'] > 0 ? 1 : 0
        this.criterions.K3 = Math.max(0, (logicFlag - this.formattedEr['о.рассужд'] - this.formattedEr['о.вывод']))
    }

    setK4(): void {
        let exSoc = this.formattedEr['ПРИМЕР.ОБЩ'] > 1 ? 1 : 0
        let exPerson = this.formattedEr['ПРИМЕР.ЛИЧ'] > 1 ? 1 : 0
        let exHist = this.formattedEr['ПРИМЕР.ИСТ'] > 1 ? 1 : 0

        this.criterions.K4 = Math.max(0, Math.min(2, exSoc + exPerson + exHist) - this.formattedEr['о.примсвязь'] - this.formattedEr['о.подтв']
            - this.formattedEr['о.дубл'] - this.formattedEr['о.факт'] - this.formattedEr['о.подробн'])
    }
}
