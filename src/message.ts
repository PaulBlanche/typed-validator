import { isComplexValidationError } from './utils';
import { ValidationError, ComplexValidationError, SimpleValidationError } from './types';

export const errorMessage = (validationError: ValidationError, t = '') => {
    if (isComplexValidationError(validationError)) {
        return complexErrorMessage(validationError, t);
    }
    return simpleErrorMessage(validationError, t);
}

const complexErrorMessage = ({ context, structure, causes }: ComplexValidationError, t = ''):string => {
    const messages = causes.map(validationError => {
        return errorMessage(validationError, t + '  ');
    });
    let message = '';
    if (structure === 'array' || structure === 'object') {
        message = `errors in ${structure} :\n${messages.join('\n')}`;
    } else if (structure === 'union') {
        message = `either :\n${messages.join('\n')}`;
    }
    return t + contextualize(message, context);
}

const simpleErrorMessage = ({ context, expected, value }: SimpleValidationError, t = '') => {
    const message = `error matching type ${expected} with value ${JSON.stringify(value)}`;
    return t + contextualize(message, context);
}

const contextualize = (message:string, context?:string|number) => {
    if (typeof context === 'number') {
        return `at index ${context}: caused by ${message}`;
    }
    if (typeof context === 'string') {
        return `on property ${context}: caused by ${message}`;
    }
    return message
}