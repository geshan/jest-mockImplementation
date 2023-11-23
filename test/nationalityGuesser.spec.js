import { guessNationalities } from '../src/nationalityGuesser.js';
import axios from 'axios';
jest.mock('axios');

const processExit = jest.spyOn(process, 'exit').mockImplementation(() => { console.log(`exit call`);});
//const consoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});


describe('guessNationalities', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should return the nationality based on the name', async () => {
    const name = 'john';

    axios.get.mockResolvedValue({ data: {
      count: 2346926,
      name: 'john',
      country: [
        { country_id: 'IE', probability: 0.075 },
        { country_id: 'KE', probability: 0.055 },
        { country_id: 'GB', probability: 0.049 },
        { country_id: 'PH', probability: 0.045 },
        { country_id: 'AU', probability: 0.045 }
      ]      
      }
    });

    await guessNationalities(name);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('https://api.nationalize.io/?name=john');

    //expect(consoleLog).toHaveBeenCalledTimes(2);
    //expect(consoleLog).toHaveBeenNthCalledWith(1, 'Nationalities for the name john are: IE - 7.5%, KE - 5.5%, GB - 4.9%, PH - 4.5%, AU - 4.5%');
    //expect(consoleLog).toHaveBeenNthCalledWith(2, 'Done!');
    expect(consoleError).not.toHaveBeenCalled();
    
    expect(processExit).toHaveBeenCalledTimes(1);
    expect(processExit).toHaveBeenCalledWith(0);
  });

  it('should handle errors and exit gracefully', async () => {
    const name = 'error';

    axios.get.mockRejectedValue(new Error('API error'));

    await guessNationalities(name);

    expect(axios.get).toHaveBeenCalledWith('https://api.nationalize.io/?name=error');
    expect(consoleError).toHaveBeenCalledWith('Error occurred: API error', expect.any(String));
    expect(processExit).toHaveBeenCalledWith(0);
    //expect(consoleLog).not.toHaveBeenCalled()
  });
});

