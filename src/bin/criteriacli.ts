#!/usr/local/bin/node
import { program } from 'commander';
import fs from 'fs';
import { CriterionFabric } from '../estimate/criterionFabric';

program.requiredOption('-p, --path <path>', 'Markup file must have path');

program.parse(process.argv);
const options = program.opts();

const fileContent = fs.readFileSync(options.path).toString('utf8');
const fileContentJson = JSON.parse(fileContent);

const criteriaResult = new CriterionFabric(fileContentJson).run();
console.log(JSON.stringify(criteriaResult));
