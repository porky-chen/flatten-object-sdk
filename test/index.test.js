const ObjectManipulator = require('../src/index');

describe('ObjectManipulator SDK with complex structure', () => {
  const objManipulator = new ObjectManipulator();
  const complexObj = {
    a: 1,
    b: 'Joy',
    c: true,
    d: undefined,
    f: Symbol('mySymbol'),
    g: null,
    cell: {
      c_a: '2',
      c_b: 'xxx',
      deep: {
        deep_a: 'inner',
        deep_b: 10,
      }
    },
    arr: [1, 2, 'apple', 'ios', 'Javascript', { arr_a: 'node', arr_b: 'TS' }],
  };

  test('flatten method with complex structure', () => {
    const flat = objManipulator.flatten(complexObj);
    expect(flat).toEqual(expect.objectContaining({
      'a': 1,
      'b': 'Joy',
      'c': true,
      'd': undefined,
      'g': null,
      'cell.c_a': '2',
      'cell.c_b': 'xxx',
      'cell.deep.deep_a': 'inner',
      'cell.deep.deep_b': 10,
      'arr[0]': 1,
      'arr[1]': 2,
      'arr[2]': 'apple',
      'arr[3]': 'ios',
      'arr[4]': 'Javascript',
      'arr[5].arr_a': 'node',
      'arr[5].arr_b': 'TS'
    }));
  });

  test('unflatten method with complex structure', () => {
    const flat = {
      'a': 1,
      'b': 'Joy',
      'c': true,
      'd': undefined,
      'g': null,
      'cell.c_a': '2',
      'cell.c_b': 'xxx',
      'cell.deep.deep_a': 'inner',
      'cell.deep.deep_b': 10,
      'arr[0]': 1,
      'arr[1]': 2,
      'arr[2]': 'apple',
      'arr[3]': 'ios',
      'arr[4]': 'Javascript',
      'arr[5].arr_a': 'node',
      'arr[5].arr_b': 'TS'
    };
    const unflat = objManipulator.unflatten(flat);
    expect(unflat).toEqual(expect.objectContaining({
      a: 1,
      b: 'Joy',
      c: true,
      d: undefined,
      g: null,
      cell: {
        c_a: '2',
        c_b: 'xxx',
        deep: {
          deep_a: 'inner',
          deep_b: 10,
        }
      },
      arr: expect.arrayContaining([1, 2, 'apple', 'ios', 'Javascript', expect.objectContaining({
        arr_a: 'node',
        arr_b: 'TS'
      })])
    }));
  });

  test('hasProperty method with complex structure', () => {
    expect(objManipulator.hasProperty(complexObj, 'a')).toBe(true);
    expect(objManipulator.hasProperty(complexObj, 'cell.c_a')).toBe(true);
    expect(objManipulator.hasProperty(complexObj, 'cell.deep.deep_b')).toBe(true);
    expect(objManipulator.hasProperty(complexObj, 'arr[5].arr_a')).toBe(true);
    expect(objManipulator.hasProperty(complexObj, 'nonexistent')).toBe(false);
    expect(objManipulator.hasProperty(complexObj, 'arr[10]')).toBe(false);
  });

  test('deleteProperty method with complex structure', () => {
    const tempObj = JSON.parse(JSON.stringify(complexObj));

    expect(objManipulator.deleteProperty(tempObj, 'cell.deep.deep_a')).toBe(true);
    expect(tempObj.cell.deep.hasOwnProperty('deep_a')).toBe(false);

    expect(objManipulator.deleteProperty(tempObj, 'arr[5].arr_a')).toBe(true);
    expect(tempObj.arr[5].hasOwnProperty('arr_a')).toBe(false);

    expect(objManipulator.deleteProperty(tempObj, 'a')).toBe(true);
    expect(tempObj.hasOwnProperty('a')).toBe(false);

    expect(objManipulator.deleteProperty(tempObj, 'nonexistent')).toBe(false);
    console.log(tempObj, 'deleteProperty');
  });

  test('insertProperty method with complex structure', () => {
    const tempObj = JSON.parse(JSON.stringify(complexObj));

    objManipulator.insertProperty(tempObj, 'cell.newProp', 'newValue');
    expect(tempObj.cell.newProp).toBe('newValue');

    objManipulator.insertProperty(tempObj, 'arr[6]', 'newArrayValue');
    expect(tempObj.arr[6]).toBe('newArrayValue');

    objManipulator.insertProperty(tempObj, 'arr[5].newInnerProp', 'newInnerValue');
    expect(tempObj.arr[5].newInnerProp).toBe('newInnerValue');

    objManipulator.insertProperty(tempObj, 'newNested.prop', 'nestedValue');
    expect(tempObj.newNested.prop).toBe('nestedValue');
    console.log(tempObj, 'insertProperty');
  });
});