import { nihil } from './nihil';
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

test('test that nihil() have return type null', (assert) => {
    const testType1 = validate(nihil())(null); 
    const type1Tester = (toTest:null) => {
        toTest;
        assert.pass('nihil() should be of type null')
    };
    type1Tester(testType1);
    assert.end();
});

test('test that nihil() validate null', (assert) => {
    const validated = validate(nihil())(null)
    assert.equal(validated, null, 'nihil() should validate null');
    assert.end();
})

test('test that nihil() does not validate anything else', (assert) => {
    const test = (value:any, message:string) => {
        assertThrows(assert)(
            () => { return validate(nihil())(value) },
            (err:any) => {
                return err.message === `error matching type ${nihil().type} with value ${JSON.stringify(value)}`;
            },
            message
        );
    }
    test(true, 'nihil() should not validate booleans');
    test(1, 'nihil() should not validate numbers');
    test("hello", 'nihil() should not validate strings');
    test(undefined, 'nihil() should not validate undefined');
    test({ a:1 }, 'nihil() should not validate objects');
    test([1,'hello'],'nihil() should not validate arrays');
    assert.end();
})


