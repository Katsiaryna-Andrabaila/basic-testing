import {
  getBankAccount,
  BankAccount,
  TransferFailedError,
  SynchronizationFailedError,
  InsufficientFundsError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(100);

    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(100);

    expect(() => account.withdraw(200)).toThrow(
      new InsufficientFundsError(account.getBalance()),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(100);
    const anotherAccount = new BankAccount(500);
    expect(() => account.transfer(200, anotherAccount)).toThrow(
      new InsufficientFundsError(account.getBalance()),
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);

    expect(() => account.transfer(200, account)).toThrow(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);

    account.deposit(200);
    expect(account.getBalance()).toBe(300);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);

    account.withdraw(50);
    expect(account.getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const account = getBankAccount(100);
    const anotherAccount = new BankAccount(500);

    account.transfer(50, anotherAccount);
    expect(account.getBalance()).toBe(50);
    expect(anotherAccount.getBalance()).toBe(550);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(100);

    const spy = jest.spyOn(lodash, 'random');
    spy.mockReturnValue(1);
    const result = await account.fetchBalance();
    expect(typeof result).toBe(typeof Number());
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(100);
    const oldBalance = account.getBalance();

    const spy = jest.spyOn(lodash, 'random');
    spy.mockReturnValue(1);
    await account.fetchBalance();
    await account.synchronizeBalance();

    const newBalance = account.getBalance();
    expect(typeof (await account.fetchBalance())).toBe(typeof Number());
    expect(oldBalance).not.toEqual(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);

    jest
      .spyOn(account, 'fetchBalance')
      .mockImplementationOnce(() => Promise.resolve(null));

    await expect(account.synchronizeBalance()).rejects.toThrow(
      new SynchronizationFailedError(),
    );
  });
});
