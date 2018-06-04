import { Validator, Validate, ValidationError } from '../types'

const type = (...validators: Validator<any>[]) =>
    validators.map(validator => validator.type).join('|')

const validate = 
    (...validators: Validator<any>[]):Validate => 
    (dirty: any) => {
        const errors: ValidationError[] = [];
        for (const validator of validators) {
            const validation = validator.validate(dirty);
            if (validation.type === 'ValdiationSuccess') {
                return validation;
            }
            errors.push(validation);
        }
        return {
            type: 'ValidationError',
            distance: Math.max(...errors.map(e => e.distance)) + 1,
            structure: 'union',
            causes: errors
        }
    }
    
export function union<T1, T2>(v1:Validator<T1>, v2:Validator<T2>): Validator<T1|T2>;
export function union<T1, T2, T3>(v1:Validator<T1>, v2:Validator<T2>, v3:Validator<T3>): Validator<T1|T2|T3>;
export function union<T1, T2, T3, T4> (v1:Validator<T1>, v2:Validator<T2>, v3:Validator<T3>, v4:Validator<T4>): Validator<T1|T2|T3|T4>;
export function union<T1, T2, T3, T4, T5> (v1:Validator<T1>, v2:Validator<T2>, v3:Validator<T3>, v4:Validator<T4>, v5:Validator<T5>): Validator<T1|T2|T3|T4|T5>;
export function union(...validators:Validator<any>[]):any {
    return {
        validate: validate(...validators),
        type: type(...validators)
    }
}

