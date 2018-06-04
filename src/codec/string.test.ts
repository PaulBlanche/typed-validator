import { string } from './string';
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

test('test that boolean() have return type boolean', (assert) => {
    const testType1 = validate(string())("hello"); 
    const type1Tester = (toTest:string) => {
        toTest;
        assert.pass('string() should be of type string')
    };
    type1Tester(testType1);
    assert.end();
});

test('test that string() validate strings', (assert) => {
    const test = (value:any, message:string) => {
        assert.equal(validate(string())(value), value, message)
    };
    test('','string() should validate empty string');
    test("hello", 'string() should validate "hello"');
    assert.end();
})

test('test that string() does not validate anything else', (assert) => {
    const test = (value:any, message:string) => {
        assertThrows(assert)(
            () => { return validate(string())(value) }, 
            (err:any) => {
                return err.message === `error matching type ${string().type} with value ${JSON.stringify(value)}`;
            },
            message
        );
    }
    test(true, 'string() should not validate booleans');
    test(1, 'string() should not validate numbers');
    test(null, 'string() should not validate null');
    test(undefined, 'string() should not validate undefined');
    test({ a:1 }, 'string() should not validate objects');
    test([1,'hello'],  'string() should not validate arrays');
    assert.end()
})
