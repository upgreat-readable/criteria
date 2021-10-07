import { RussianL } from './subj-processors/russianL';
import { AbstractProcessor } from './subj-processors/abstractProcessor';
import * as iCriterion from '../interfaces/iCriterionFabric';
import { Literature } from './subj-processors/literature';
import { SocialScience } from './subj-processors/socialScience';
import { History } from './subj-processors/history';
import * as subjCodes from '../support/subjectCodes';
import { EnglishL } from './subj-processors/englishL';
import { ArCriterions } from '../interfaces/iCriterionFabric';
import { RussianLFree } from './subj-processors/russianLFree';

export class CriterionFabric implements iCriterion.ICriterionFabric {
  markUpExample: any;
  subject: string;

  constructor(markUpExample: object) {
    this.markUpExample = markUpExample;
    this.subject = this.getSubj();
  }

  public run(webMode: boolean = false): ArCriterions {
    let subjObject = this.decisionCriterionClass(this.subject, webMode);
    return subjObject.analyze();
  }

  public decisionCriterionClass(
    subj: string,
    webMode: boolean,
  ): AbstractProcessor {
    if (!subj) {
      throw new Error('Не был получен код предмета.');
    }

    switch (subj) {
      case subjCodes.russianLanguage:
        return new RussianL(this.markUpExample, webMode);
      case subjCodes.russianLanguageFree:
        return new RussianLFree(this.markUpExample, webMode);
      case subjCodes.literature:
        return new Literature(this.markUpExample, webMode);
      case subjCodes.socialScience:
        return new SocialScience(this.markUpExample, webMode);
      case subjCodes.history:
        return new History(this.markUpExample, webMode);
      case subjCodes.englishLanguage:
      case subjCodes.englishLanguageFree:
        return new EnglishL(this.markUpExample, webMode);
    }

    throw new Error(
      'Данный предмет не поддерживается сервисом распознавания критериев.',
    );
  }

  public getSubj(): string {
    return this.markUpExample.meta.subject;
  }
}
