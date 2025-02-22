import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export function MatchesPasswordPattern(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "matchesPasswordPattern",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
                    return typeof value === 'string' && passwordRegex.test(value); 
                },
                defaultMessage(args: ValidationArguments) {
                    return 'La password deve contenere almeno un carattere maiuscolo, uno minuscolo, un numero e un carattere speciale'
                }
            }
        });
    };
}
