import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const array = [2, 4];
    const list = generateLinkedList(array);
    expect(list).toStrictEqual({
      next: { next: { next: null, value: null }, value: 4 },
      value: 2,
    });
  });

  test('should generate linked list from values 2', () => {
    const array = [1, 5, 7, 9];
    const list = generateLinkedList(array);
    expect(list).toMatchInlineSnapshot(`
      {
        "next": {
          "next": {
            "next": {
              "next": {
                "next": null,
                "value": null,
              },
              "value": 9,
            },
            "value": 7,
          },
          "value": 5,
        },
        "value": 1,
      }
    `);
  });
});
