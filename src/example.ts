import { CriterionFabric } from './estimate/criterionFabric';
import { Operations } from './support/operations';

const markUpExample = {
  meta: {
    theme: 'Какова роль литературы в жизни человека? (Ф.А. Абрамов)',
    taskText:
      '(1) Старая деревня с её тысячелетней историей уходит сегодня в небытие.(2) А это значит - рушатся вековые устои, исчезает та многовековая почва, на которой росла вся наша национальная культура: её этика и эстетика, её фольклор и литература, её чудо-язык. (3) Деревня - наши истоки, наши корни.(4) Деревня - материнское лоно, где зарождался наш национальный характер.\n' +
      '(5) И вот сегодня, когда старая деревня доживает свои последние дни, мы с новым, особым, обостренным вниманием вглядываемся в тот тип человека, который был создан ею, вглядываемся в наших матерей и отцов, дедов и бабок.\n' +
      '(6) Ох, немного выпало на их долю добрых слов!(7) А ведь именно на них, на плечах этих безымянных тружеников и воинов, прочно стоит здание всей нашей сегодняшней жизни!\n' +
      '(8) Вспомним, к примеру, только один подвиг русской женщины в минувшей войне.(9) Ведь это она, русская баба, своей сверхчеловеческой работой ещё в сорок первом году открыла второй фронт, которого так жаждала Советская Армия. (10) А как, какой мерой измерить подвиг той же русской бабы в послевоенную пору, в те времена, когдаона, зачастую сама голодная, раздетая и разутая, кормила и одевала страну, с истинным терпением и безропотностью русской крестьянки несла тяжелый крест вдовы-солдатки, матери погибших на войне сыновей!\n' +
      '(11) Так что же удивительного, что старая крестьянка в нашей литературе на время потеснила, а порой и заслонила собой других персонажей?(12) Вспомним «Матрёнин двор» А. Солженицына, «Последний срок» В. Распутина, героинь В. Шукшина, А. Астафьева и В. Белова. (13) Нет, не идеализация это деревенской жизни и не тоска по уходящей избяной Руси, как с бездумной легкостью и высокомерием вещают некоторые критики и писатели, а наша сыновняя, хотя и запоздалая благодарность.\n' +
      '(14) Это стремление осмыслить и удержать духовный опыт людей старшего поколения, тот нравственный потенциал, те нравственные силы, которые не дали пропасть России в годы самых тяжелых испытаний.\n' +
      '(15) Да, эти героини темные и малограмотные, да, наивные и чересчур доверчивые, но какие душевные россыпи, какой душевный свет! (16) Бесконечная самоотверженность, обостренная русская совесть и чувство долга, способность к самоограничению и состраданию, любовь к труду, к земле и ко всему живому - да всего не перечислишь.\n' +
      '(17) К сожалению, современный молодой человек, возвращенный в иных, более благоприятных условиях, не всегда наследует эти жизненно важные качества.(18) И одна из главнейших задач современной литературы - предостеречь молодежь от опасности душевного очерствения, помочь ей усвоить и обогатить духовный багаж, накопленный предшествующими поколениями.\n' +
      '(19) В последнее время мы много говорим о сохранении природной среды, памятников материальной культуры. (20) Не пора ли с такой же энергией и напором ставить вопрос о сохранности и защите непреходящих ценностей духовной культуры, накопленной вековым народным опытом...',
    class: '11',
    year: '2017',
    subject: 'eng',
    test: 'егэ тренировка',
    expert: 'exp001',
  },
  criteria: {},
  selections: [
    {
      id: 138,
      startSelection: 138,
      endSelection: 145,
      type: 'А.грамм',
      comment: '',
      explanation: 'Форма множественного числа',
      correction: '',
      tag: '',
      group: 'error',
      subtype: 'множ',
    },
    {
      id: 480,
      startSelection: 435,
      endSelection: 483,
      type: 'А.стиль',
      comment: '',
      explanation: 'Стилистическая ошибка. Риторический вопрос.',
      correction: '',
      tag: '',
      group: 'error',
      subtype: 'ритор',
    },
    {
      id: 592,
      startSelection: 484,
      endSelection: 610,
      type: 'ЛМНЕНИЕ',
      comment: '',
      explanation:
        'Личное мнение. Автор не приводит свое мнение, а дает рекомендации , что делать .',
      correction: '',
      tag: '',
      group: 'meaning',
      subtype: '',
    },
    {
      id: 867,
      startSelection: 665,
      endSelection: 673,
      type: 'А.грамм',
      comment: '',
      explanation: 'Видовременная форма глагола',
      correction: '',
      tag: '',
      group: 'error',
      subtype: 'видовр',
    },
    {
      id: 1062,
      startSelection: 812,
      endSelection: 816,
      type: 'А.логика',
      comment: '',
      explanation: 'Логическая ошибка',
      correction: '',
      tag: '',
      group: 'error',
      subtype: '',
    },
    {
      id: 1062,
      startSelection: 812,
      endSelection: 816,
      type: 'П.отнош',
      comment: '',
      explanation: 'Логическая ошибка',
      correction: '',
      tag: '',
      group: 'error',
      subtype: '',
    },
    {
      id: 1062,
      startSelection: 812,
      endSelection: 816,
      type: 'ОТНОШЕНИЕ',
      comment: '',
      explanation: 'Логическая ошибка',
      correction: '',
      tag: '',
      group: 'error',
      subtype: '',
    },
  ],
  text: 'Мама мыла раму.',
};

let y = new CriterionFabric(markUpExample).run();
console.log(y);
console.log(Operations.objectSum(y));

// let x = new AppointmentFabric(markUpExample, markUpExample).appointThirdExpert()
// console.log(x);