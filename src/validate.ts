import { errorMessage } from './message';
import { Validator } from './types';

export const validate = 
    <T>(validator: Validator<T>) => 
    (dirty: any): T => {
        const validation = validator.validate(dirty);
        if (validation.type === 'ValidationError') {
            throw Error(errorMessage(validation));
        }
        return dirty;
    }