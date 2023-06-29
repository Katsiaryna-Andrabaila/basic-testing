import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const result = resolveValue('value');
    expect(result).resolves.toEqual('value');
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect(() => throwError('Error!')).toThrow(new Error('Error!'));
  });

  test('should throw error with default message if message is not provided', () => {
    expect(throwError).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(throwCustomError).toThrow(new MyAwesomeError().message);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const result = rejectCustomError();
    expect(result).rejects.toThrow(new MyAwesomeError().message);
  });
});
