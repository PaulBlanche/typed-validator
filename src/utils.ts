import { Validation, ValidationError, ComplexValidationError, SimpleValidationError, ValidationSuccess } from './types';

export const getType = (dirty: any) => {
    if (dirty === null || dirty === undefined) return 'null';
    if (Array.isArray(dirty)) return 'array';
    if (typeof dirty === 'string') return 'string';
    if (typeof dirty === 'number') return 'number';
    if (typeof dirty === 'boolean') return 'boolean';
    return 'object';
}

export const isValidationError = 
    (validation: Validation): validation is ValidationError => {
        return validation.type === 'ValidationError';
    }

export const isComplexValidationError = 
    (validation: Validation):validation is ComplexValidationError => {
        return isValidationError(validation) && 'causes' in validation;
    }

export const success = 
    ():ValidationSuccess => ({ 
        type:'ValdiationSuccess' 
    })

export const simpleError = 
    ({ expected, value, distance=0 }: { expected:string, value:any, distance?:number }):SimpleValidationError => ({
        type: 'ValidationError',
        distance,
        expected,
        value,    
    })