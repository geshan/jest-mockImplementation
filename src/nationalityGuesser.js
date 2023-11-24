import axios from 'axios';

export async function guessNationalities(name) {
  try {
    const response = await axios.get(`https://api.nationalize.io/?name=${name}`);
    const hasCountryData = response?.data?.country && response.data.country.length;

    console.log(`Nationalities for the name ${name} are: ${hasCountryData ? response.data.country.map(c => `${c.country_id} - ${c.probability * 100}%`).join(', ') : 'none'}`);
    console.log('Done!');
  } catch (err) {
    console.error(`Error occurred: ${err.message}`, err.stack);
    process.exit(1);
  }
}

