import { guessNationalities } from './src/nationalityGuesser.js';
const args = process.argv.slice(2);


const name = args[0] || 'john';
await guessNationalities(name);
