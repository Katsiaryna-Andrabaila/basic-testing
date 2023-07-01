import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const mockData = [
  { id: 1, title: 'awesome album', userId: 1 },
  { id: 2, title: 'funny album', userId: 2 },
];

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const create = jest.spyOn(axios, 'create');

    jest.spyOn(axios.Axios.prototype, 'get').mockImplementationOnce(() =>
      Promise.resolve({
        data: mockData,
      }),
    );

    jest.runAllTimers();
    await throttledGetDataFromApi('test');

    expect(create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const get = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: mockData,
        }),
      );

    jest.runAllTimers();
    await throttledGetDataFromApi('test');

    expect(get).toHaveBeenCalledWith('test');
  });

  test('should return response data', async () => {
    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementationOnce(async () => ({
        data: mockData,
      }));

    jest.runAllTimers();
    const result = await throttledGetDataFromApi('test');

    expect(result).toStrictEqual(mockData);
  });
});
