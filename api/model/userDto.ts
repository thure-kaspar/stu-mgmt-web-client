/**
 * Student-Management-System-API
 * The Student-Management-System-API. <a href=\'http://localhost:3000/api-json\'>JSON</a>
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CourseDto } from './courseDto';


export interface UserDto { 
    /**
     * Unique identifier of this user.
     */
    id?: string;
    /**
     * Role within the application.
     */
    role: UserDto.RoleEnum;
    matrNr?: number;
    email?: string;
    username: string;
    displayName: string;
    courses?: Array<CourseDto>;
}
export namespace UserDto {
    export type RoleEnum = 'SYSTEM_ADMIN' | 'ADMIN_TOOL' | 'MGMT_ADMIN' | 'USER';
    export const RoleEnum = {
        SYSTEM_ADMIN: 'SYSTEM_ADMIN' as RoleEnum,
        ADMIN_TOOL: 'ADMIN_TOOL' as RoleEnum,
        MGMT_ADMIN: 'MGMT_ADMIN' as RoleEnum,
        USER: 'USER' as RoleEnum
    };
}


