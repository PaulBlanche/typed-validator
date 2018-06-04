import { validate } from './utils';
import { Validator } from '../types';

export const value = 
    <TYPE extends string|number|boolean>(value:TYPE): Validator<TYPE> => ({
        validate: validate(JSON.stringify(value), (dirty) => dirty === value),
        type: JSON.stringify(value),
    });
