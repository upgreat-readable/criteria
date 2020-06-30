import {AbstractProcessor} from "../subj-processors/abstractProcessor";

export interface ICriterionFabric {
    decisionCriterionClass(subj: string): AbstractProcessor
    getSubj(): string
}

export type ArCriterions = {[key: string]: string}
export type MarkUpData = {
    metas: {
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
        [key: string]: string
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
