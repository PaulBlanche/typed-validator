import { number } from './number';
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

test('test that number() have return type number', (assert) => {
    const testType1 = validate(number())(1); 
    const type1Tester = (toTest:number) => {
        toTest;
        assert.pass('number() should be of type number')
    };
    type1Tester(testType1);
    assert.end();
});

test('test that number() validate numbers', (assert) => {
    const test = (value:any, message:string) => {
        assert.equal(validate(number())(value), value, message);
    }
    test(1, 'number() should validate 1')
    test(0.134, 'number() should validate 0.134')
    test(-87332, 'number() should validate -87332')
    assert.end();
})

test('test that number() does not validate anything else', (assert) => {
    const test = (value:any, message:string) => {
        assertThrows(assert)(
            () => { return validate(number())(value) }, 
            (err:any) => {
                return err.message === `error matching type ${number().type} with value ${JSON.stringify(value)}`;
            },
            message
        );
    }
    test(true, 'number() should not validate booleans');
    test("hello", 'number() should not validate strings');
    test(null, 'number() should not validate null');
    test(undefined, 'number() should not validate undefined');
    test({ a:1 }, 'number() should not validate objects');
    test([1,'hello'], 'number() should not validate arrays');
    assert.end();
})
