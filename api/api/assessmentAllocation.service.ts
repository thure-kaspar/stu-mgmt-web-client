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
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { AssessmentAllocationDto } from '../model/assessmentAllocationDto';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class AssessmentAllocationService {

    protected basePath = '/';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Copy assessment allocation from another assignment
     * Applies the allocations from another assignment to the specified assignment.
     * @param courseId 
     * @param assignmentId 
     * @param existingAssignmentId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addAllocationsFromExistingAssignment(courseId: string, assignmentId: string, existingAssignmentId: string, observe?: 'body', reportProgress?: boolean): Observable<Array<AssessmentAllocationDto>>;
    public addAllocationsFromExistingAssignment(courseId: string, assignmentId: string, existingAssignmentId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<AssessmentAllocationDto>>>;
    public addAllocationsFromExistingAssignment(courseId: string, assignmentId: string, existingAssignmentId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<AssessmentAllocationDto>>>;
    public addAllocationsFromExistingAssignment(courseId: string, assignmentId: string, existingAssignmentId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling addAllocationsFromExistingAssignment.');
        }

        if (assignmentId === null || assignmentId === undefined) {
            throw new Error('Required parameter assignmentId was null or undefined when calling addAllocationsFromExistingAssignment.');
        }

        if (existingAssignmentId === null || existingAssignmentId === undefined) {
            throw new Error('Required parameter existingAssignmentId was null or undefined when calling addAllocationsFromExistingAssignment.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Array<AssessmentAllocationDto>>('post',`${this.basePath}/courses/${encodeURIComponent(String(courseId))}/assignments/${encodeURIComponent(String(assignmentId))}/assessment-allocations/from-existing/${encodeURIComponent(String(existingAssignmentId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param courseId 
     * @param assignmentId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public assessmentAllocationControllerRemoveAllAllocationsOfAssignment(courseId: string, assignmentId: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public assessmentAllocationControllerRemoveAllAllocationsOfAssignment(courseId: string, assignmentId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public assessmentAllocationControllerRemoveAllAllocationsOfAssignment(courseId: string, assignmentId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public assessmentAllocationControllerRemoveAllAllocationsOfAssignment(courseId: string, assignmentId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling assessmentAllocationControllerRemoveAllAllocationsOfAssignment.');
        }

        if (assignmentId === null || assignmentId === undefined) {
            throw new Error('Required parameter assignmentId was null or undefined when calling assessmentAllocationControllerRemoveAllAllocationsOfAssignment.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<any>('delete',`${this.basePath}/courses/${encodeURIComponent(String(courseId))}/assignments/${encodeURIComponent(String(assignmentId))}/assessment-allocations/all`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Assign assessment to evaluator
     * Maps an evaluator to a group or user. If the group or user is already assigned to another evaluator, changes the evaluator.
     * @param body 
     * @param courseId 
     * @param assignmentId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createAllocation(body: AssessmentAllocationDto, courseId: string, assignmentId: string, observe?: 'body', reportProgress?: boolean): Observable<AssessmentAllocationDto>;
    public createAllocation(body: AssessmentAllocationDto, courseId: string, assignmentId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<AssessmentAllocationDto>>;
    public createAllocation(body: AssessmentAllocationDto, courseId: string, assignmentId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<AssessmentAllocationDto>>;
    public createAllocation(body: AssessmentAllocationDto, courseId: string, assignmentId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling createAllocation.');
        }

        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling createAllocation.');
        }

        if (assignmentId === null || assignmentId === undefined) {
            throw new Error('Required parameter assignmentId was null or undefined when calling createAllocation.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<AssessmentAllocationDto>('post',`${this.basePath}/courses/${encodeURIComponent(String(courseId))}/assignments/${encodeURIComponent(String(assignmentId))}/assessment-allocations`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get assessment allocations
     * Returns a list of allocations, which map an evaluator to a group or user.
     * @param courseId 
     * @param assignmentId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getAllocations(courseId: string, assignmentId: string, observe?: 'body', reportProgress?: boolean): Observable<Array<AssessmentAllocationDto>>;
    public getAllocations(courseId: string, assignmentId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<AssessmentAllocationDto>>>;
    public getAllocations(courseId: string, assignmentId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<AssessmentAllocationDto>>>;
    public getAllocations(courseId: string, assignmentId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling getAllocations.');
        }

        if (assignmentId === null || assignmentId === undefined) {
            throw new Error('Required parameter assignmentId was null or undefined when calling getAllocations.');
        }

        let headers = this.defaultHeaders;

        // authentication (bearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Array<AssessmentAllocationDto>>('get',`${this.basePath}/courses/${encodeURIComponent(String(courseId))}/assignments/${encodeURIComponent(String(assignmentId))}/assessment-allocations`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Remove allocation
     * Removes the assignment of the specified group or user. Throws error, if removal was unsuccessful.
     * @param courseId 
     * @param assignmentId 
     * @param groupId Query must specify either groupId or userId.
     * @param userId Query must specify either groupId or userId.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public removeAllocation(courseId: string, assignmentId: string, groupId?: string, userId?: string, observe?: 'body', reportProgress?: boolean): Observable<any>;
    public removeAllocation(courseId: string, assignmentId: string, groupId?: string, userId?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<any>>;
    public removeAllocation(courseId: string, assignmentId: string, groupId?: string, userId?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<any>>;
    public removeAllocation(courseId: string, assignmentId: string, groupId?: string, userId?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling removeAllocation.');
        }

        if (assignmentId === null || assignmentId === undefined) {
            throw new Error('Required parameter assignmentId was null or undefined when calling removeAllocation.');
        }



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (groupId !== undefined && groupId !== null) {
            queryParameters = queryParameters.set('groupId', <any>groupId);
        }
        if (userId !== undefined && userId !== null) {
            queryParameters = queryParameters.set('userId', <any>userId);
        }

        let headers = this.defaultHeaders;

        // authentication (bearer) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }
        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<any>('delete',`${this.basePath}/courses/${encodeURIComponent(String(courseId))}/assignments/${encodeURIComponent(String(assignmentId))}/assessment-allocations`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
