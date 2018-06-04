import { any } from './any';
import { validate } from '../validate';
import * as test from 'tape';

test('test that any() have return type any', (assert) => {
    const testType1 = validate(any())([]) 
    const type1Tester = (toTest:any) => {
        toTest;
        assert.pass('any() should be of type any');
    };
    type1Tester(testType1);
    assert.end();
});

test('test that any() validate anything', (assert) => {
    const _validate = (value:any, message:string) => {
        assert.equal(validate(any())(value), value, message)
    }
    _validate(1, "any() should validate numbers");
    _validate("hello", "any() should validate strings");
    _validate(null, "any() should validate null");
    _validate(undefined, "any() should validate undefined");
    _validate({a:1}, "any() should validate objects");
    _validate([1,'hello'], "any() should validate arrays");
    assert.end();
})
