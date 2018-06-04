import { validate } from './utils';
import { Validator } from '../types';

export const any = 
    (): Validator<any> => ({
        validate: validate('any', () => true),
        type: 'any',
    });
