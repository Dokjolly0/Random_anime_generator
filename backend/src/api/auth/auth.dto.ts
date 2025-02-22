import { IsEmail, IsString, MinLength } from "class-validator";
import { MatchesPasswordPattern } from "../../utils/matchesPasswordPattern";

export class AddUserDTO {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    username: string;

    @MinLength(8)
    @MatchesPasswordPattern({
        message: 'La password deve contenere almeno un carattere maiuscolo, uno minuscolo, un numero e un carattere speciale'
    })
    password: string;
}

export class LoginDTO {
    @IsEmail()
    username: string;

    @IsString()
    password: string;
}