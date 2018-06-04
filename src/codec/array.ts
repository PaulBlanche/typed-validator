import { success, simpleError, isValidationError } from '../utils';
import { Validator, Validate, ValidationError } from '../types';

export const array = 
    <T>(validator: Validator<T>): Validator<Array<T>> => ({
        validate: validate(validator),
        type: type(validator),
    });

const validate = 
    (validator: Validator<any>):Validate => 
    (dirty: any) => {
        if(!Array.isArray(dirty)) {
            return simpleError({
                expected: type(validator),
                value: dirty
            }) 
        }
        const errors:ValidationError[] = [];
        for (const [index, item] of Array.from(dirty.entries())) {
            const validation = validator.validate(item);
            if (isValidationError(validation)) {
                validation.context = index;
                errors.push(validation)
            }
        }
        if (errors.length !== 0) {
            return {
                type: 'ValidationError',
                distance: Math.max(...errors.map(e => e.distance)) + 1,
                structure: 'array',
                causes: errors
            }
        }
        return success();
    }

const type = 
    <T>(validator: Validator<T>) => {
        let inner = validator.type;
        if (inner.indexOf('|') !== -1) {
            inner = '(' + inner + ')';
        }
        return inner + '[]';
    };


