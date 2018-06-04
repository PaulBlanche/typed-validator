import { typeValidator } from './utils';
import { Validator } from '../types';

export const number = 
    ():Validator<number> => 
        typeValidator<number>('number'); 