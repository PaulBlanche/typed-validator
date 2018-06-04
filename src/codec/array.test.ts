import { array } from './array';
import { string } from './string';
import { value } from './value';
import { union } from './union';
import { Validator } from '../types';
import { validate } from '../validate';
import * as test from 'tape';

const assertThrows = 
    (assert:test.Test) => 
    (fn:() => void, check:(err:any) => boolean, message:string) => {
        try {
            fn();
        } catch (e) {
            assert.ok(check(e), message);
        }
    }

test('test that array() have return type array', (assert) => {
    const testType1 = validate(array(string()))([]) 
    const type1Tester = (toTest:string[]) => {
        toTest;
        assert.pass('array(string()) should be of type string[]')
    };
    type1Tester(testType1);

    const testType2 = validate(array(value(2)))([])
    const type2Tester = (toTest:2[]) => {
        toTest;
        assert.pass('array(value(2)) should be of type 2[]')
    };
    type2Tester(testType2)

    const testType3 = validate(array(union(string(), array(value(2)))))([])
    const type3Tester = (toTest:(string|2[])[]) => {
        toTest;
        assert.pass('array(union2(string(), array(value(2)))) should be of type (string|2)[]')
    }
    type3Tester(testType3);
    assert.end();
})

test('test that array() validate arrays', (assert) => {
    const _validate = <T> (validator:Validator<T>, val:any, message:string) => {
        assert.equal(validate(array(validator))(val), val, message)
    }
    _validate(string(), [], 'array(string()) should validate empty array')
    _validate(string(), ["hello", "world"], 'array(string()) should validate array of strings')
    _validate(value(1), [], 'array(value(1)) should validate empty array')
    _validate(value(1), [1, 1], 'array(value(1)) should validate array of 1')
    _validate(union(value(1), string()), [], 'array(union2(value(1), string())) should validate empty array')
    _validate(union(value(1), string()), [1, 1, 1], 'array(union2(value(1), string())) should validate array of 1')
    _validate(union(value(1), string()), ["hello", "world"], 'array(union2(value(1), string())) should validate array of strings')
    _validate(union(value(1), string()), ["hello", 1, "world", 1, 1], 'array(union2(value(1), string())) should validate array of strings and 1')
    assert.end();
})

test('test that array() does not validate anything else', (assert) => {
    const _validate = (val:any, message:string) => {
        assertThrows(assert)(
            () => { return validate(array(string()))(val) }, 
            (err) => {
                return err.message === `error matching type ${array(string()).type} with value ${JSON.stringify(val)}`
            },
            message
        );
    }
    _validate(true, 'array() should not validate boolean');
    _validate(1, 'array() should not validate 1');
    _validate("hallo", 'array() should not validate strings');
    _validate(null, 'array() should not validate null');
    _validate(undefined, 'array() should not validate undefined');
    _validate({ a:1 }, 'array() should not validate objects');
    assert.end();
})

test('test that array() validate its items', (assert) => {
    const _validate = <T> (validator:Validator<T>, val:any, expected:string, message:string) => {
        assertThrows(assert)(
            () => { return validate(array(validator))(val) },
            (err) => {
                return err.message === expected;
            },
            message
        );
    }
    _validate(string(), [1, 1], 
    `errors in array :
  at index 0: caused by error matching type string with value 1
  at index 1: caused by error matching type string with value 1`, 
    'array(string()) should not validate array of numbers');
    _validate(string(), ["hello", 1], 
    `errors in array :
  at index 1: caused by error matching type string with value 1`, 
    'array(string()) should not validate array of not just strings');
    _validate(union(value(1), string()), ["hello", 2], 
    `errors in array :
  at index 1: caused by either :
    error matching type 1 with value 2
    error matching type string with value 2`, 
    'array(union2(value(1), string())) should not validate array containing a 2');
    _validate(union(value(1), array(string())), [[2], 1], 
    `errors in array :
  at index 0: caused by either :
    error matching type 1 with value [2]
    errors in array :
      at index 0: caused by error matching type string with value 2`, 
    'array(union2(value(1), array(string())) should not validate');
    assert.end();
})
