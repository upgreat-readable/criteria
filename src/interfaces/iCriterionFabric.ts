import {AbstractProcessor} from "../estimate/subj-processors/abstractProcessor";

export interface ICriterionFabric {
    decisionCriterionClass(subj: string): AbstractProcessor
    getSubj(): string
}

export type ArCriterions = {[key: string]: number}
export type MarkUpData = {
    meta: {
        subject: string,
        test: string,
        category: string,
        year: number,
        class: number,
        theme: string,
        taskText: string
    },
    criterias: {
        [key: string]: number
    },
    selections: [
        {
            id: number,
            tag: string,
            type: string,
            group: 'meaning' | 'error',
            comment: string,
            subtype: string,
            explanation: string,
            startSelection: number,
            endSelection: number,
        }
    ],
    text: string
}
