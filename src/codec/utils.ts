import { getType, success, simpleError } from '../utils';
import { Validator, Validate } from '../types';

export const validate = 
    (type: string, check:(dirty:any) => boolean): Validate => 
    (dirty) => {
        if (check(dirty)) {
            return success()
        }
        return simpleError({
            expected: type,
            value: dirty
        });
    }

export const typeValidator = 
    <TYPE>(type:string): Validator<TYPE> => ({
        validate: validate(type, (dirty) => getType(dirty) === type),
        type,
    });
        
