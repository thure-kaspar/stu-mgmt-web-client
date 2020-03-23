/**
 * Student-Management-System-API
 * The Student-Management-Sytem-API description.
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface UpdateMessage { 
    type: UpdateMessage.TypeEnum;
    affectedObject: UpdateMessage.AffectedObjectEnum;
    courseId: string;
    entityId: string;
    entityIdRelation?: string;
    date?: Date;
}
export namespace UpdateMessage {
    export type TypeEnum = 'INSERT' | 'UPDATE' | 'REMOVE';
    export const TypeEnum = {
        INSERT: 'INSERT' as TypeEnum,
        UPDATE: 'UPDATE' as TypeEnum,
        REMOVE: 'REMOVE' as TypeEnum
    };
    export type AffectedObjectEnum = 'USER' | 'GROUP' | 'USER_GROUP_RELATION' | 'COURSE_USER_RELATION' | 'ASSIGNMENT';
    export const AffectedObjectEnum = {
        USER: 'USER' as AffectedObjectEnum,
        GROUP: 'GROUP' as AffectedObjectEnum,
        USERGROUPRELATION: 'USER_GROUP_RELATION' as AffectedObjectEnum,
        COURSEUSERRELATION: 'COURSE_USER_RELATION' as AffectedObjectEnum,
        ASSIGNMENT: 'ASSIGNMENT' as AffectedObjectEnum
    };
}