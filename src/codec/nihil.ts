import { validate } from './utils';
import { Validator } from '../types';

export const nihil = 
    (): Validator<null> => ({
        validate: validate('null', (dirty) => dirty === null),
        type: 'null',
    });
