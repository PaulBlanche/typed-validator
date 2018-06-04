import { boolean } from './boolean';
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
    const testType1 = validate(boolean())(true); 
    const type1Tester = (toTest:boolean) => {
        toTest;
        assert.pass('boolean() should be of type boolean')
    };
    type1Tester(testType1);
    assert.end();
});

test('test that boolean() validate booleans', (assert) => {
    const test = (value:any, message:string) => {
        assert.equal(validate(boolean())(value), value, message);
    }
    test(true, 'boolean() should validate true');
    test(false, 'boolean() should validate false');
    assert.end();
})

test('test that boolean() does not validate anything else', (assert) => {
    const test = (value:any, message:string) => {
        assertThrows(assert)(
            () => { return validate(boolean())(value) }, 
            (err) => {
                return err.message === `error matching type ${boolean().type} with value ${JSON.stringify(value)}`;
            },
            message
        );
    }
    test(1, 'boolean() should not match numbers');
    test("hello", 'boolean() should not match strings');
    test(null, 'boolean() should not match null');
    test(undefined, 'boolean() should not match undefined');
    test({ a:1 }, 'boolean() should not match objects');
    test([1,'hello'], 'boolean() should not match arrays');
    assert.end();
})

