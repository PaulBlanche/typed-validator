import { Validator } from '../types';
import { success } from '../utils';

export const optional = 
    <T>(validator:Validator<T>): Validator<T|null|undefined> => ({
        validate: (dirty) => {
            if (dirty === undefined || dirty === null) {
                return success();
            }
            return validator.validate(dirty);
        },
        type: `${validator.type}|undefined|null`,
    });