import { MinLength } from "class-validator";
import { MatchesPasswordPattern } from "../../utils/matchesPasswordPattern";

export class ChangePasswordDTO {

    @MinLength(8)
    @MatchesPasswordPattern({
        message: 'La password deve contenere almeno un carattere maiuscolo, uno minuscolo, un numero e un carattere speciale'
    })
    newPassword: string;
}