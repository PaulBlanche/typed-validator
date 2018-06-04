import { getType, success, simpleError, isValidationError } from '../utils';
import { Validator, Validate, ValidationError } from '../types';

export type ObjectDefinition = {
    [key:string]: Validator<any>
}

type Unpack<DEFINITION extends ObjectDefinition> = {
    [KEY in keyof DEFINITION]: DEFINITION[KEY] extends Validator<infer TYPE> ? TYPE : never;
}

export const object = 
    <DEFINITION extends ObjectDefinition>(definition: DEFINITION): Validator<Unpack<DEFINITION>> => ({
        validate: validate(definition),
        type: type(definition),
    });

const validate = (definition: ObjectDefinition):Validate => (dirty: any) => {
    if (getType(dirty) !== 'object') {
        return simpleError({
            expected: type(definition),
            value: dirty
        })
    }
    const errors:ValidationError[] = [];
    const keys = Object.keys(dirty);
    for (const [key, validator] of Object.entries(definition)) {
        keys.splice(keys.indexOf(key), 1)
        const validation = validator.validate(dirty[key]);
        if (isValidationError(validation)) {
            validation.context = key;
            errors.push(validation)
        }
    }
    if (errors.length !== 0) {
        return {
            type: 'ValidationError',
            distance: Math.max(...errors.map(e => e.distance)) + 1,
            structure: 'object',
            causes: errors
        }
    }
    if (keys.length !== 0) {
        return simpleError({
            expected: type(definition),
            value: dirty
        })
    }
    return success();
}

const type = (definition: ObjectDefinition) => {
    let inner = '{ ';
    for (const [key, validator] of Object.entries(definition)) {
        inner = inner + key + ': ' + validator.type + ' ';
    }
    return inner + '}';
}
