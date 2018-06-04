import { typeValidator } from './utils';
import { Validator } from '../types';

export const boolean = 
    ():Validator<boolean> => 
        typeValidator<boolean>('boolean'); 