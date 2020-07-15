import {AbstractProcessor} from "../estimate/subj-processors/abstractProcessor";

export interface ICriterionFabric {
    decisionCriterionClass(subj: string): AbstractProcessor
    getSubj(): string
}

export type ArCriterions = {[key: string]: number}
export type MarkUpData = {
    meta: {
        topic: string,
        class: number,
        year: number,
        subject: string,
        test: string,
        category: string,
        expert: string,
        timeMarkup: string,
    },
    criterias: {
        [key: string]: number
    },
    selections: [
        {
            id: number,
            startSelection: number,
            endSelection: number,
            code: string,
            comment: string,
            explanation: string,
            correction: string,
            tag: string,
            type: 'meaning' | 'error',
        }
    ],
    originalText: string
}
