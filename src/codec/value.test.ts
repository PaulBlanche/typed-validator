import { value } from './value';
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

test('test that value(val) have return type val', (assert) => {
    const testType1 = validate(value("hello"))("hello"); 
    const type1Tester = (toTest:"hello") => {
        toTest;
        assert.pass('value("hello") should be of type "hello"')
    };
    type1Tester(testType1);

    const testType2 = validate(value(2))(2); 
    const type2Tester = (toTest:2) => {
        toTest;
        assert.pass('value(2) should be of type 2')
    };
    type2Tester(testType2);

    const testType3 = validate(value(false))(false); 
    const type3Tester = (toTest:false) => {
        toTest;
        assert.pass('value(false) should be of type false')
    };
    type3Tester(testType3);
    assert.end();

});

test('test that value() validate its value', (assert) => {
    const test = (val:any, message:string) => {
        assert.equal(validate(value(val))(val), val, message)
    }
    test("hello", 'value("hello") should validate "hello"')
    test(1, 'value(1) should validate 1')
    test(true, 'value(true) should validate true')
    assert.end();
})

test('test that value() does not validate anything else', (assert) => {
    const test = (val:any, message:string) => {
        assertThrows(assert)(
            () => { return validate(value("hello"))(val) }, 
            (err:any) => {
                return err.message === `error matching type ${value("hello").type} with value ${JSON.stringify(val)}`;
            },
            message
        );
    }
    test(true, 'value("hello") should not validate booleans');
    test(1, 'value("hello") should not validate numbers');
    test("world", 'value("hello") should not validate other strings');
    test(null, 'value("hello") should not validate null');
    test(undefined, 'value("hello") should not validate undefined');
    test({ a:1 }, 'value("hello") should not validate objects');
    test([1,'hello'], 'value("hello") should not validate arrays');
    assert.end();
})


