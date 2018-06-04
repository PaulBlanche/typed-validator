import { object, ObjectDefinition } from './object';
import { string } from './string';
import { value } from './value';
import { union } from './union';
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

test('test that object() have return type object', (assert) => {
    const testType1 = validate(object({
        a:string(),
        b:value(1),
    }))({ a:'hello', b:1 });
    const type1Tester = (toTest:{ a:string, b:1 }) => {
        toTest;
        assert.pass('object({ a:string(), b:value(1) }) should be of type { a:string, b:1 }')
    };
    type1Tester(testType1);
    
    const testType2 = validate(object({
        a:string(),
        b:object({
            c:value(true),
            d:union(value(1), string())
        }),
    }))({ a:'hello', b: { c:true, d:1 } });
    const typeTester2 = (toTest:{ a:string, b:{ c:true, d:1|string } }) => {
        toTest;
        assert.pass('object({ a:string(), b:object({ c:value(true), d:union(value(1), string()) }) }) should be of type { a:string, b:{ c:true, d:1|string } }')
    };
    typeTester2(testType2);    
    
    assert.end();
});

test('test that object() validate object', (assert) => {
    const test = (definition:ObjectDefinition, val:any, message:string) => {
        assert.equal(validate(object(definition))(val), val, message);
    }
    test({}, {}, 'object({}) should validate empty object')
    test({ a:string() }, { a:'hello' }, 'object({ a:string() }) should validate { a:string }')
    test({ a:object({ b:value(1) }) }, { a:{ b:1 } }, 'object({ a:object({ b:value(1) }) }) should validate { a: { b:1 } }')
    assert.end()
})

test('test that object() does not validate anything else', (assert) => {
    const test = (definition:ObjectDefinition, val:any, message:string) => {
        assertThrows(assert)(
            () => { return validate(object(definition))(val) }, 
            (err:any) => {
                return err.message === `error matching type ${object(definition).type} with value ${JSON.stringify(val)}`;
            },
            message
        );
    }
    test({}, true, 'object() should not validate booleans');
    test({}, 1, 'object() should not validate numbers');
    test({}, "hallo", 'object() should not validate strings');
    test({}, null, 'object() should not validate null');
    test({}, undefined, 'object() should not validate undefined');
    test({}, [1, "hello"], 'object() should not validate array');
    assert.end()
})

test('test that object() validate its items', (assert) => {
    const _validate = (definition:ObjectDefinition, val:any, expected:string, message:string) => {
        assertThrows(assert)(
            () => { return validate(object(definition))(val) },
            (err) => {
                return err.message === expected;
            },
            message
        );
    }
    _validate({ a: string() }, { a: 1 }, 
    `errors in object :
  on property a: caused by error matching type string with value 1`, 
    'object({ a:string() }) should not validate { a:number }');
    _validate({ a: string() }, { b: "hello" }, 
    `errors in object :
  on property a: caused by error matching type string with value undefined`, 
    'object({ a:string() }) should not validate { b:string }');
    _validate({ a: string() }, { a:'hello', b: "world" }, 
    'error matching type { a: string } with value {"a":"hello","b":"world"}', 
    'object({ a:string() }) should not validate { a:string, b:string }');
    _validate({ a: object({ b: string() }) }, { a: { b: 2 } }, 
    `errors in object :
  on property a: caused by errors in object :
    on property b: caused by error matching type string with value 2`, 
    'object({ a:object({ b:string() })}) should not validate { a: { b: number }}');
    assert.end();
})
