import {AbstractProcessor} from "./abstractProcessor";
import {Operations} from "../../support/operations";
import {historyMaxPoints} from "../../support/constants";

export class History extends AbstractProcessor {
    criterions = {
        K1: 0,
        K2: 0,
        K3: 0,
        K4: 0,
        K5: 0,
        K6: 0,
        K7: 0
    }

    predefinedValues: string[] = [
        'СОБЫТИЕ', 'СЯП', 'РОЛЬ', 'ПРИЧИНА', 'СЛЕДСТВИЕ', 'ОЦЕНКА',
        'И.событие', 'И.сяп', 'И.период',
        'И.личность', 'И.лсвязь', 'И.лпериод', 'И.лроль', 'И.лдейств',
        'И.причин', 'И.следств',
        'И.влиян', 'И.упрощ',
        'И.понятие', 'И.неиспол',
        'И.факт',
        'И.излож']

    roles = [
        {
            'roleId': 1,
            'code': 'РОЛЬ',
            'tag': '',
            'count': 0,
            'elems': {
                'И.личность': 0,
                'И.лсвязь': 0,
                'И.лпериод': 0,
                'И.лроль': 0,
                'И.лдейств': 0
            }
        },
        {
            'roleId': 2,
            'code': 'РОЛЬ',
            'tag': '',
            'count': 0,
            'elems': {
                'И.личность': 0,
                'И.лсвязь': 0,
                'И.лпериод': 0,
                'И.лроль': 0,
                'И.лдейств': 0
            }
        }
    ]

    reasonConsequence = [
        {
            'rcId': 1,
            'rcIdTag': '',
            'reason': 0,
            'consequence': 0,
            'elems': {
                'И.причин': 0,
                'И.следств': 0
            }
        },
        {
            'rcId': 2,
            'rcIdTag': '',
            'reason': 0,
            'consequence': 0,
            'elems': {
                'И.причин': 0,
                'И.следств': 0
            }
        }
    ]


    /*
        К1 = max(0, min(2, СЯП – И.сяп – И.период));
        если (К1=0) то К=К1=…=К7=0 и далее оценивание не производится;
        выделяются две совокупности фрагментов, описывающих две исторические личности:
        Личн1 = [РОЛЬ1>0] – [И.личность1 + И.лсвязь1 + И.лпериод1 + И.лроль1 + И.лдейств1 >0];
        Личн2 = [РОЛЬ2>0] – [И.личность2 + И.лсвязь2 + И.лпериод2 + И.лроль2 + И.лдейств2 >0];
        К2 = Личн1 + Личн2;
        выделяются две пары фрагментов, описывающих две причинно-следственные связи:
        ПСС1 = [ПРИЧИНА1>0 и СЛЕДСТВИЕ1>0] – [И.причин1 + И.следств1 >0];
        ПСС2 = [ПРИЧИНА2>0 и СЛЕДСТВИЕ2>0] – [И.причин2 + И.следств2 >0];
        К3 = ПСС1 + ПСС2;
        K4 = [ОЦЕНКА>0] – [И.влиян + И.упрощ>0];
        K5 = 1 – [И.понятие + И.неиспол >0];
        К6 = max(0, 3 – И.факт);
        если (К1+К2+К3+К4<5) то К7 = 0;
        иначе К7 = [И.излож=0 и К1+К2+К3+К4>=5];
        К = К1 + …. + К7. Максимальное значение К = 12.
     */
    analyze(): any {
        this.fillBasicRoleFragments()

        super.analyze()

        this.setK1()

        if (this.criterions.K1 === 0) {
            return this.criterions
        }

        this.setK2()
        this.setK3()
        this.setK4()
        this.setK5()
        this.setK6()
        this.setK7()

        if (Operations.objectSum(this.criterions) > historyMaxPoints) {
            throw new Error('Высчитанное количество баллов превысило максимально допустимое значение.')
        }

        return this.criterions
    }

    setK1(): void {
        this.criterions.K1 = Math.max(0, Math.min(2, Operations.diff(this.formattedEr['СЯП'], this.formattedEr['И.сяп'], this.formattedEr['И.период'])))
    }

    //@todo оптимизировать через foreach определение двух параметров в ряду
    setK2(): void {

        let sum1 = Operations.sum(this.roles[0].elems['И.личность'], this.roles[0].elems['И.лсвязь'], this.roles[0].elems['И.лпериод'], this.roles[0].elems['И.лроль'], this.roles[0].elems['И.лдейств'])
        let factor1 = Operations.compare(sum1, 0, '>')

        let sum2 = Operations.sum(this.roles[1].elems['И.личность'], this.roles[1].elems['И.лсвязь'], this.roles[1].elems['И.лпериод'], this.roles[1].elems['И.лроль'], this.roles[1].elems['И.лдейств'])
        let factor2 = Operations.compare(sum2, 0, '>')


        let person1 = Operations.diff(this.roles[0].count, factor1)
        let person2 = Operations.diff(this.roles[1].count, factor2)

        this.criterions.K2 = Operations.sum(person1, person2)
    }

    //@todo оптимизировать через foreach определение двух параметров в ряду
    setK3(): void {
        let param1: number
        Operations.compare(this.reasonConsequence[0].reason, 0, '>') && Operations.compare(this.reasonConsequence[0].consequence, 0, '>') ? param1 = 1 : param1 = 0

        let sumToParam2 = Operations.sum(this.reasonConsequence[0].elems['И.причин'], this.reasonConsequence[0].elems['И.следств'])
        let param2 = Operations.compare(sumToParam2, 0, '>')

        let pss1 = param1 + param2


        let param3: number
        Operations.compare(this.reasonConsequence[1].reason, 0, '>') && Operations.compare(this.reasonConsequence[1].consequence, 0, '>') ? param3 = 1 : param3 = 0

        let sumToParam4 = Operations.sum(this.reasonConsequence[1].elems['И.причин'], this.reasonConsequence[1].elems['И.следств'])
        let param4 = Operations.compare(sumToParam4, 0, '>')

        let pss2 = param3 + param4

        this.criterions.K3 = pss1 + pss2
    }

    setK4(): void {
        let rating = Operations.compare(this.formattedEr['ОЦЕНКА'], 0, '>')

        let sumToParam2 = Operations.sum(this.formattedEr['И.влиян'], this.formattedEr['И.упрощ'])
        let param2 = Operations.compare(sumToParam2, 0, '>')

        this.criterions.K4 = Operations.diff(rating, param2)
    }

    setK5(): void {
        let sumToParam = Operations.sum(this.formattedEr['И.понятие'], this.formattedEr['И.неиспол'])
        let param = Operations.compare(sumToParam, 0, '>')

        this.criterions.K5 = Operations.diff(1, param)
    }

    setK6(): void {
        this.criterions.K6 = Math.max(0, 3 - this.formattedEr['И.факт'])
    }

    setK7(): void {
        if (Operations.sum(this.criterions.K1, this.criterions.K2, this.criterions.K3, this.criterions.K4) < 5) {
            this.criterions.K7 = 0
        } else {
            let param1 = Operations.compare(this.formattedEr['И.излож'], 0, '=')
            let param2 = Operations.sum(this.criterions.K1, this.criterions.K2, this.criterions.K3, this.criterions.K4) >= 5
             if (param1 && param2) {
                 this.criterions.K7 = 1
             } else {
                 this.criterions.K7 = 0
             }
        }
    }

    fillBasicRoleFragments(): void {
        let incR: number = 0
        let incP: number = 0
        let incS: number = 0

        for (let i in this.markUpData.selections) {
            switch (this.markUpData.selections[i].type) {
                case 'РОЛЬ':
                    this.fillTheFirstTwoRoles(incR, this.markUpData.selections[i]) ? incR++ : ''
                    break
                case 'ПРИЧИНА':
                    this.fillTheFirstTwoReason(incP, this.markUpData.selections[i]) ? incP++ : ''
                    break
                case 'СЛЕДСТВИЕ':
                    this.fillTheFirstTwoConsequence(incS, this.markUpData.selections[i]) ? incS++ : ''
                    break
            }
        }

        this.setRoleFragmentVariables([0, 1])
        this.setRcFragmentVariables([0, 1])
    }


    /*
    @method fillTheFirstTwoRoles, fillTheFirstTwoReason, fillTheFirstTwoConsequence
    работает только с первыми двумя, встреченными итеративно элементами
     */
    fillTheFirstTwoRoles(inc: number, selection: any): boolean {
        if ([0, 1].includes(inc)) {
            this.roles[inc].count = 1
            this.roles[inc].tag = selection.tag
            return true
        }
        return false
    }

    fillTheFirstTwoReason(inc: number, selection: any): boolean {
        if ([0, 1].includes(inc)) {
            this.reasonConsequence[inc].reason = 1
            this.reasonConsequence[inc].rcIdTag = selection.tag
            return true
        }
        return false
    }

    fillTheFirstTwoConsequence(inc: number, selection: any): boolean {
        if ([0, 1].includes(inc)) {
            this.reasonConsequence[inc].consequence = 1
            return true
        }
        return false
    }

    setRoleFragmentVariables(arRoleIndex = [0, 1]): void {
        for (let roleIndex of arRoleIndex) {
            let roleTag = this.roles[roleIndex].tag
            let roleElems: any = this.roles[roleIndex].elems

            for (let k in this.markUpData.selections) {
                let curCode: string = this.markUpData.selections[k].type
                let curTag: string = this.markUpData.selections[k].tag
                if (roleElems.hasOwnProperty(curCode) && curTag === roleTag) {
                    roleElems[curCode] = roleElems[curCode] + 1
                }
            }

            this.roles[roleIndex].elems = roleElems
        }

        // console.log(this.roles);
    }

    setRcFragmentVariables(arRoleIndex = [0, 1]): void {
        for (let roleIndex of arRoleIndex) {
            let roleTag = this.reasonConsequence[roleIndex].rcIdTag
            let roleElems: any = this.reasonConsequence[roleIndex].elems

            for (let k in this.markUpData.selections) {
                let curCode: string = this.markUpData.selections[k].type
                let curTag: string = this.markUpData.selections[k].tag
                if (roleElems.hasOwnProperty(curCode) && curTag === roleTag) {
                    roleElems[curCode] = roleElems[curCode] + 1
                }
            }

            this.reasonConsequence[roleIndex].elems = roleElems
        }

        // console.log(this.reasonConsequence);
    }


}
