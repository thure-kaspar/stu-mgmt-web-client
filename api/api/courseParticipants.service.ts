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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { CanJoinCourseDto } from '../model/models';
import { ChangeCourseRoleDto } from '../model/models';
import { ParticipantDto } from '../model/models';
import { ParticipantsComparisonDto } from '../model/models';
import { ParticipantsWithAssignedEvaluatorDto } from '../model/models';
import { PasswordDto } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class CourseParticipantsService {

    protected basePath = 'http://localhost';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Add user to course.
     * Adds a user to the course. If the course requires a password, the correct password needs to be included in the request body.
     * @param passwordDto 
     * @param courseId 
     * @param userId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addUser(passwordDto: PasswordDto, courseId: string, userId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined}): Observable<any>;
    public addUser(passwordDto: PasswordDto, courseId: string, userId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined}): Observable<HttpResponse<any>>;
    public addUser(passwordDto: PasswordDto, courseId: string, userId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined}): Observable<HttpEvent<any>>;
    public addUser(passwordDto: PasswordDto, courseId: string, userId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined}): Observable<any> {
        if (passwordDto === null || passwordDto === undefined) {
            throw new Error('Required parameter passwordDto was null or undefined when calling addUser.');
        }
        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling addUser.');
        }
        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling addUser.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (bearer) required
        credential = this.configuration.lookupCredential('bearer');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<any>(`${this.configuration.basePath}/courses/${encodeURIComponent(String(courseId))}/users/${encodeURIComponent(String(userId))}`,
            passwordDto,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Check if joining is possible.
     * Checks, if the user is able to join the course. A user can join a course, if he\&#39;s not already a member and the course is not closed.
     * @param courseId 
     * @param userId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public canUserJoinCourse(courseId: string, userId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<CanJoinCourseDto>;
    public canUserJoinCourse(courseId: string, userId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<CanJoinCourseDto>>;
    public canUserJoinCourse(courseId: string, userId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<CanJoinCourseDto>>;
    public canUserJoinCourse(courseId: string, userId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling canUserJoinCourse.');
        }
        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling canUserJoinCourse.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (bearer) required
        credential = this.configuration.lookupCredential('bearer');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<CanJoinCourseDto>(`${this.configuration.basePath}/courses/${encodeURIComponent(String(courseId))}/users/${encodeURIComponent(String(userId))}/canJoin`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Compare participants list..
     * Returns an Object, which divides the course participants in two groups (in/out).
     * @param courseId 
     * @param compareToCourseIds 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public compareParticipantsList(courseId: string, compareToCourseIds: Array<string>, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<ParticipantsComparisonDto>;
    public compareParticipantsList(courseId: string, compareToCourseIds: Array<string>, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<ParticipantsComparisonDto>>;
    public compareParticipantsList(courseId: string, compareToCourseIds: Array<string>, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<ParticipantsComparisonDto>>;
    public compareParticipantsList(courseId: string, compareToCourseIds: Array<string>, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling compareParticipantsList.');
        }
        if (compareToCourseIds === null || compareToCourseIds === undefined) {
            throw new Error('Required parameter compareToCourseIds was null or undefined when calling compareParticipantsList.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (compareToCourseIds) {
            compareToCourseIds.forEach((element) => {
                queryParameters = this.addToHttpParams(queryParameters,
                  <any>element, 'compareToCourseIds');
            })
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (bearer) required
        credential = this.configuration.lookupCredential('bearer');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<ParticipantsComparisonDto>(`${this.configuration.basePath}/courses/${encodeURIComponent(String(courseId))}/users/query/compare-participants-list`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get participant.
     * Retrieves a specific participant and course related information about the participant.
     * @param courseId 
     * @param userId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getParticipant(courseId: string, userId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<ParticipantDto>;
    public getParticipant(courseId: string, userId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<ParticipantDto>>;
    public getParticipant(courseId: string, userId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<ParticipantDto>>;
    public getParticipant(courseId: string, userId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling getParticipant.');
        }
        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling getParticipant.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (bearer) required
        credential = this.configuration.lookupCredential('bearer');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<ParticipantDto>(`${this.configuration.basePath}/courses/${encodeURIComponent(String(courseId))}/users/${encodeURIComponent(String(userId))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get participants of course by matrNr.
     * Returns participants by their matrNr. The response only includes participants that were found, meaning unknown matrNrs will be ignored.
     * @param courseId 
     * @param matrNr 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getParticipantsByMatrNr(courseId: string, matrNr: Array<number>, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<ParticipantDto>>;
    public getParticipantsByMatrNr(courseId: string, matrNr: Array<number>, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<ParticipantDto>>>;
    public getParticipantsByMatrNr(courseId: string, matrNr: Array<number>, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<ParticipantDto>>>;
    public getParticipantsByMatrNr(courseId: string, matrNr: Array<number>, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling getParticipantsByMatrNr.');
        }
        if (matrNr === null || matrNr === undefined) {
            throw new Error('Required parameter matrNr was null or undefined when calling getParticipantsByMatrNr.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (matrNr) {
            matrNr.forEach((element) => {
                queryParameters = this.addToHttpParams(queryParameters,
                  <any>element, 'matrNr');
            })
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (bearer) required
        credential = this.configuration.lookupCredential('bearer');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<ParticipantDto>>(`${this.configuration.basePath}/courses/${encodeURIComponent(String(courseId))}/users/matrNrs`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get participants with assigned evaluator.
     * Returns participants with their assigned evaluator for a particular assignment.
     * @param courseId 
     * @param assignmentId 
     * @param skip [Pagination] The amount of elements that should be skipped.
     * @param take [Pagination] The amount of elements that should be included in the response.
     * @param assignedEvaluatorId Filter by assigned evaluator.
     * @param excludeAlreadyReviewed Excludes groups/users that have already been reviewed.
     * @param nameOfGroupOrUser Filter by group or username.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getParticipantsWithAssignedEvaluator(courseId: string, assignmentId: string, skip?: number, take?: number, assignedEvaluatorId?: string, excludeAlreadyReviewed?: boolean, nameOfGroupOrUser?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<ParticipantsWithAssignedEvaluatorDto>>;
    public getParticipantsWithAssignedEvaluator(courseId: string, assignmentId: string, skip?: number, take?: number, assignedEvaluatorId?: string, excludeAlreadyReviewed?: boolean, nameOfGroupOrUser?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<ParticipantsWithAssignedEvaluatorDto>>>;
    public getParticipantsWithAssignedEvaluator(courseId: string, assignmentId: string, skip?: number, take?: number, assignedEvaluatorId?: string, excludeAlreadyReviewed?: boolean, nameOfGroupOrUser?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<ParticipantsWithAssignedEvaluatorDto>>>;
    public getParticipantsWithAssignedEvaluator(courseId: string, assignmentId: string, skip?: number, take?: number, assignedEvaluatorId?: string, excludeAlreadyReviewed?: boolean, nameOfGroupOrUser?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling getParticipantsWithAssignedEvaluator.');
        }
        if (assignmentId === null || assignmentId === undefined) {
            throw new Error('Required parameter assignmentId was null or undefined when calling getParticipantsWithAssignedEvaluator.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (skip !== undefined && skip !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>skip, 'skip');
        }
        if (take !== undefined && take !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>take, 'take');
        }
        if (assignedEvaluatorId !== undefined && assignedEvaluatorId !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>assignedEvaluatorId, 'assignedEvaluatorId');
        }
        if (excludeAlreadyReviewed !== undefined && excludeAlreadyReviewed !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>excludeAlreadyReviewed, 'excludeAlreadyReviewed');
        }
        if (nameOfGroupOrUser !== undefined && nameOfGroupOrUser !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>nameOfGroupOrUser, 'nameOfGroupOrUser');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (bearer) required
        credential = this.configuration.lookupCredential('bearer');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<ParticipantsWithAssignedEvaluatorDto>>(`${this.configuration.basePath}/courses/${encodeURIComponent(String(courseId))}/users/assignments/${encodeURIComponent(String(assignmentId))}/with-assigned-evaluator`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get users of course.
     * Returns a collection of users that are signed up for this course.
     * @param courseId 
     * @param skip [Pagination] The amount of elements that should be skipped.
     * @param take [Pagination] The amount of elements that should be included in the response.
     * @param courseRole 
     * @param name Compared to the participant\&#39;s username and displayName with ILIKE %name%.
     * @param groupName Filters by a student\&#39;s current group. Compared with ILIKE %groupName%.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getUsersOfCourse(courseId: string, skip?: number, take?: number, courseRole?: Array<'LECTURER' | 'TUTOR' | 'STUDENT'>, name?: string, groupName?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<Array<ParticipantDto>>;
    public getUsersOfCourse(courseId: string, skip?: number, take?: number, courseRole?: Array<'LECTURER' | 'TUTOR' | 'STUDENT'>, name?: string, groupName?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<Array<ParticipantDto>>>;
    public getUsersOfCourse(courseId: string, skip?: number, take?: number, courseRole?: Array<'LECTURER' | 'TUTOR' | 'STUDENT'>, name?: string, groupName?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<Array<ParticipantDto>>>;
    public getUsersOfCourse(courseId: string, skip?: number, take?: number, courseRole?: Array<'LECTURER' | 'TUTOR' | 'STUDENT'>, name?: string, groupName?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling getUsersOfCourse.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (skip !== undefined && skip !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>skip, 'skip');
        }
        if (take !== undefined && take !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>take, 'take');
        }
        if (courseRole) {
            courseRole.forEach((element) => {
                queryParameters = this.addToHttpParams(queryParameters,
                  <any>element, 'courseRole');
            })
        }
        if (name !== undefined && name !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>name, 'name');
        }
        if (groupName !== undefined && groupName !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>groupName, 'groupName');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (bearer) required
        credential = this.configuration.lookupCredential('bearer');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<Array<ParticipantDto>>(`${this.configuration.basePath}/courses/${encodeURIComponent(String(courseId))}/users`,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Remove user from course.
     * Removes the user from the course. Returns true, if removal was successful.
     * @param courseId 
     * @param userId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public removeUser(courseId: string, userId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined}): Observable<any>;
    public removeUser(courseId: string, userId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined}): Observable<HttpResponse<any>>;
    public removeUser(courseId: string, userId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined}): Observable<HttpEvent<any>>;
    public removeUser(courseId: string, userId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined}): Observable<any> {
        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling removeUser.');
        }
        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling removeUser.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (bearer) required
        credential = this.configuration.lookupCredential('bearer');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.delete<any>(`${this.configuration.basePath}/courses/${encodeURIComponent(String(courseId))}/users/${encodeURIComponent(String(userId))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update user\&#39;s role in course.
     * Assigns the given role to the user of this course.
     * @param changeCourseRoleDto 
     * @param courseId 
     * @param userId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateUserRole(changeCourseRoleDto: ChangeCourseRoleDto, courseId: string, userId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined}): Observable<any>;
    public updateUserRole(changeCourseRoleDto: ChangeCourseRoleDto, courseId: string, userId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined}): Observable<HttpResponse<any>>;
    public updateUserRole(changeCourseRoleDto: ChangeCourseRoleDto, courseId: string, userId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined}): Observable<HttpEvent<any>>;
    public updateUserRole(changeCourseRoleDto: ChangeCourseRoleDto, courseId: string, userId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined}): Observable<any> {
        if (changeCourseRoleDto === null || changeCourseRoleDto === undefined) {
            throw new Error('Required parameter changeCourseRoleDto was null or undefined when calling updateUserRole.');
        }
        if (courseId === null || courseId === undefined) {
            throw new Error('Required parameter courseId was null or undefined when calling updateUserRole.');
        }
        if (userId === null || userId === undefined) {
            throw new Error('Required parameter userId was null or undefined when calling updateUserRole.');
        }

        let headers = this.defaultHeaders;

        let credential: string | undefined;
        // authentication (bearer) required
        credential = this.configuration.lookupCredential('bearer');
        if (credential) {
            headers = headers.set('Authorization', 'Bearer ' + credential);
        }

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.patch<any>(`${this.configuration.basePath}/courses/${encodeURIComponent(String(courseId))}/users/${encodeURIComponent(String(userId))}/role`,
            changeCourseRoleDto,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
