// import { CriterionFabric } from './estimate/criterionFabric';
// import { Operations } from './support/operations';
// import fs from 'fs';
//
// var files = fs
//   .readdirSync('../testFiles/rus/')
//   .map(function (v) {
//     return {
//       name: v,
//       time: fs.statSync('../testFiles/rus/' + v).mtime.getTime(),
//     };
//   })
//   .sort(function (a, b) {
//     return a.time - b.time;
//   })
//   .map(function (v) {
//     return v.name;
//   });
//
// files = files.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item));
// // console.log(files);
//
// if (files) {
//   files.forEach((value, index, array) => {
//     console.log(value);
//     let markUpExample = JSON.parse(
//       // @ts-ignore
//       fs.readFileSync('../testFiles/rus/' + value, 'utf8'),
//     );
//     let y = new CriterionFabric(markUpExample).run();
//     console.log(y);
//   });
// }
//
// // let y = new CriterionFabric(markUpExample).run();
// // console.log(y);
// // console.log(Operations.objectSum(y));
//
// // let x = new AppointmentFabric(markUpExample, markUpExample).appointThirdExpert()
// // console.log(x);
