import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

const someFunc = () => 'result';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const timeout = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(someFunc, 2000);

    expect(timeout).toHaveBeenCalledTimes(1);
    expect(timeout).toHaveBeenLastCalledWith(someFunc, 2000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 2000);

    expect(callback).not.toBeCalled();

    jest.runAllTimers();

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const interval = jest.spyOn(global, 'setInterval');
    doStuffByInterval(someFunc, 2000);
    expect(interval).toHaveBeenCalledTimes(1);
    expect(interval).toHaveBeenLastCalledWith(someFunc, 2000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(5000);

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(5);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const join = jest.spyOn(path, 'join');

    await readFileAsynchronously('pathToFile');
    expect(join).toBeCalledWith(__dirname, 'pathToFile');
  });

  test('should return null if file does not exist', async () => {
    const content = await readFileAsynchronously('pathToFile');
    expect(content).toBe(null);
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockImplementationOnce(() => true);
    jest
      .spyOn(fsPromises, 'readFile')
      .mockImplementationOnce(async () => 'file content');

    const content = await readFileAsynchronously('pathToFile');
    expect(content).toBe('file content');
  });
});
