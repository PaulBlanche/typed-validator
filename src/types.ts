export type Validator<TYPE> = {
    validate: Validate,
    type: string;
    tag?: TYPE; // prevent compiler complaining about TYPE not being used
}

export type Validate = (dirty: any) => Validation;

export type Validation = ValidationSuccess | ValidationError;

export type ValidationSuccess = {
    type:'ValdiationSuccess'
}

export type ValidationError = SimpleValidationError | ComplexValidationError

export type SimpleValidationError = BaseValidationError & {
    expected: string,
    value: any,
}
export type ComplexValidationError = BaseValidationError & {
    structure: string,
    causes : ValidationError[]
}

type BaseValidationError = {
    type: 'ValidationError',
    distance: number,
    context?: string|number
}
