import { typeValidator } from './utils';
import { Validator } from '../types';

export const string = 
    ():Validator<string> => 
        typeValidator<string>('string'); 