/**
 * Student-Management-System-API
 * The Student-Management-Sytem-API. <a href='http://localhost:3000/api-json'>JSON</a>
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { UserDto } from './userDto';

export interface ParticipantsComparisonDto { 
    inComparedCourses: Array<UserDto>;
    notInComparedCourses: Array<UserDto>;
}