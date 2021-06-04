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
import { LinkDto } from './linkDto';


export interface AssignmentDto { 
    /**
     * Unique identifier of this assignment.
     */
    id?: string;
    /**
     * The title of this assignment.
     */
    name: string;
    /**
     * Determines, wether students can submit, assessments should be published, etc.
     */
    state: AssignmentDto.StateEnum;
    /**
     * Date at which this assignment should enter the IN_PROGRESS-state to allow submissions.
     */
    startDate?: string;
    /**
     * Date at which this assignment should enter the IN_REVIEW-state to disable submissions.
     */
    endDate?: string;
    /**
     * The type of assignment, i.e homework or project.
     */
    type: AssignmentDto.TypeEnum;
    /**
     * Determines, wether students can submit their solutions in groups, alone or both.
     */
    collaboration: AssignmentDto.CollaborationEnum;
    /**
     * The amount of points that can be reached by a participant (exluding bonus points).
     */
    points: number;
    /**
     * The amount of additional bonus points, which should be exluded from the admission criteria.
     */
    bonusPoints?: number;
    /**
     * Additional information or description of this assignment.
     */
    comment?: string;
    links?: Array<LinkDto>;
}
export namespace AssignmentDto {
    export type StateEnum = 'INVISIBLE' | 'CLOSED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'EVALUATED';
    export const StateEnum = {
        INVISIBLE: 'INVISIBLE' as StateEnum,
        CLOSED: 'CLOSED' as StateEnum,
        IN_PROGRESS: 'IN_PROGRESS' as StateEnum,
        IN_REVIEW: 'IN_REVIEW' as StateEnum,
        EVALUATED: 'EVALUATED' as StateEnum
    };
    export type TypeEnum = 'HOMEWORK' | 'TESTAT' | 'SEMINAR' | 'PROJECT' | 'OTHER';
    export const TypeEnum = {
        HOMEWORK: 'HOMEWORK' as TypeEnum,
        TESTAT: 'TESTAT' as TypeEnum,
        SEMINAR: 'SEMINAR' as TypeEnum,
        PROJECT: 'PROJECT' as TypeEnum,
        OTHER: 'OTHER' as TypeEnum
    };
    export type CollaborationEnum = 'GROUP' | 'SINGLE' | 'GROUP_OR_SINGLE';
    export const CollaborationEnum = {
        GROUP: 'GROUP' as CollaborationEnum,
        SINGLE: 'SINGLE' as CollaborationEnum,
        GROUP_OR_SINGLE: 'GROUP_OR_SINGLE' as CollaborationEnum
    };
}


