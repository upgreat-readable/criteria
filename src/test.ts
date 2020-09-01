import {RussianL} from "./estimate/subj-processors/russianL";
import {CriterionFabric} from "./estimate/criterionFabric";
import {Operations} from "./support/operations";
import {AppointmentFabric} from "./appointment/appointmentFabric";

const markUpExample = {
    meta: {
        theme: 'Какова роль литературы в жизни человека? (Ф.А. Абрамов)',
        taskText: '(1) Старая деревня с её тысячелетней историей уходит сегодня в небытие.(2) А это значит - рушатся вековые устои, исчезает та многовековая почва, на которой росла вся наша национальная культура: её этика и эстетика, её фольклор и литература, её чудо-язык. (3) Деревня - наши истоки, наши корни.(4) Деревня - материнское лоно, где зарождался наш национальный характер.\n' +
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
        expert: 'exp001'
    },
    criterias: {},
    selections: [
        {
            id: 100,
            startSelection: 100,
            endSelection: 148,
            type: 'Г.слов',
            comment: '',
            explanation: '',
            correction: '',
            tag: '',
            group: 'meaning',
            subtype: ''
        },
        {
            id: 160,
            startSelection: 149,
            endSelection: 196,
            type: 'Г.слов',
            comment: '',
            explanation: '',
            correction: '',
            tag: '',
            group: 'meaning',
            subtype: ''
        },
        {
            id: 219,
            startSelection: 197,
            endSelection: 232,
            type: 'Г.слов',
            comment: 'Комментарий',
            explanation: 'Пояснение',
            correction: 'Исправление',
            tag: 'Тег',
            group: 'meaning',
            subtype: ''
        },
        {
            id: 306,
            startSelection: 233,
            endSelection: 314,
            type: 'Г.слов',
            comment: 'Комментарий',
            explanation: 'Пояснение',
            correction: 'Исправление',
            tag: 'Тег',
            group: 'meaning',
            subtype: ''
        },
        {
            id: 440,
            startSelection: 315,
            endSelection: 366,
            type: 'Г.слов',
            comment: '',
            explanation: '',
            correction: '',
            tag: '',
            group: 'meaning',
            subtype: 'словообр'
        },
        {
            id: 512,
            startSelection: 367,
            endSelection: 405,
            type: 'ИСП',
            comment: '',
            explanation: '',
            correction: 'моё справление',
            tag: '',
            group: 'meaning',
            subtype: ''
        },
        {
            id: 575,
            startSelection: 406,
            endSelection: -1,
            type: 'Г.слов',
            comment: '',
            explanation: '',
            correction: '',
            tag: '',
            group: 'meaning',
            subtype: ''
        },
        {
            id: 743,
            startSelection: 0,
            endSelection: 0,
            type: 'П.однообр',
            comment: '',
            explanation: '',
            correction: '',
            tag: '',
            group: 'meaning',
            subtype: ''
        },
        {
            id: 758,
            startSelection: 563,
            endSelection: 607,
            type: 'Г.слов',
            comment: '',
            explanation: '',
            correction: '',
            tag: 'ег',
            group: 'meaning',
            subtype: ''
        },
        {
            id: 819,
            startSelection: 608,
            endSelection: 652,
            type: 'Г.слов',
            comment: '',
            explanation: '',
            correction: '',
            tag: 'ег',
            group: 'meaning',
            subtype: ''
        },
        {
            id: 880,
            startSelection: 653,
            endSelection: 696,
            type: 'Г.слов',
            comment: '',
            explanation: '',
            correction: '',
            tag: '',
            group: 'error',
            subtype: ''
        },
        {
            id: 935,
            startSelection: 697,
            endSelection: 754,
            type: 'ПРОБЛЕМА',
            comment: '',
            explanation: '',
            correction: 'моё исправление',
            tag: '',
            group: 'error',
            subtype: ''
        },
        {
            id: 957,
            startSelection: 708,
            endSelection: 720,
            type: 'Г.слов',
            comment: 'мой комментарий',
            explanation: '',
            correction: '',
            tag: '',
            group: 'meaning',
            subtype: ''
        }
    ],
    text: "Подтип ошибки или комментарий кратко объясняет учащемуся суть ошибки. Для каждого типа ошибок в классификаторе предусмотрено несколько подтипов. Каждому подтипу соответствует свой стандартный комментарий (то есть подтип ошибки – это, по сути, аббревиатура для стандартного комментария). Если эксперт считает, что ни один из стандартных комментариев не подходит для данного случая, то он может записать свой комментарий. Текст комментария должен быть лаконичным и называть типовую ошибку, встречающуюся во многих работах. Комментарий не должен обращаться к тексту данной работы."
};

let y = new CriterionFabric(markUpExample).run()
console.log(y);
console.log(Operations.objectSum(y));

// let x = new AppointmentFabric(markUpExample, markUpExample).appointThirdExpert()
// console.log(x);
