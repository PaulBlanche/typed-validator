# typed-validator

Validate (runtime) and cast (compile-time) data.

## motivation

With typescript we can strongly type our code. But when we recieve a JSON from "outside", we have : 
    * to validate it hold the expected type at runtime. 
    * to cast it to the expected type at compile-time. 
This is redudant. After validating that this property is a string, it should by string typed ! Needing to both validate and cast means our code is not DRY.

This library defines composable validators that can be used to validate and cast custom types

## usage

```typescript
import { validate, object, string, value, array, union2 } from 'typed-validator';

const adultValidator = object({
    type: value('adult'),
    name: string(),
    job: string(),
});

const childValidator = object({
    type: value('adult'),
    name: string(),
    parents: array(string())
})

const houseValidator = object({
    address: string(),
    occupants: array(union2(childValidator, adultValidator))
})

const any:any = JSON.parse(`{
    "address": "276 Ronsom street",
    "occupants": [{
        "type": "adult",
        "name": "Mark",
        "job": "cook",
    }, {
        "type": "adult",
        "name": "Jane",
        "job": "laywer",
    }, {
        "type": "adult",
        "name": "Agatha",
        "job": "retired",
    }, {
        "type": "child",
        "name": "Timmy",
        "parents": ["Jane", "Mark"]
    }]
}`);

const house = validate(houseValidator)(any);
    /* typeof house = { 
            address:string, 
            occupants: (
                { type:'adult', name:string, job:string }|
                {type:'child', name:string, parents:string[] }
            )[] 
        }
    */
```

The function `validate` will type the result according to the types defined in the validator. `validate` will throw an exception if the "validatee" does not pass the validation.

## validators

### `any()`
Validate anything

### `<T> array(validator:Validator<T>)`
Validate that the object is an array, and that each item is validated by `validator`.

### `boolean()`
Validate that the object is a boolean.

### `nihil()`
Validate that the object is null.

### `number()`
Validate that this object is a number.

### `object(definition:ObjectDefinition)`
Validate tha the object is an object, and that each property is validated by the corresponding property on `definition`.

### `<T> optional(validator:Validator<T>)`
Validate that the object is null or undefined, or that it is validated by `validator`.

### `string()`
Validate that the object is a string.

### `<...T> union(...validators:Validator<T>[])`
Validate that the object validate at least one of the validator in `validators`.
 
### `<V> value(val:V)`
Validate that the object is exactly the value


