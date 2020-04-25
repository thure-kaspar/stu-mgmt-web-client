import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AssessmentsService } from './api/assessments.service';
import { AssignmentsService } from './api/assignments.service';
import { AuthenticationService } from './api/authentication.service';
import { CourseConfigService } from './api/courseConfig.service';
import { CoursesService } from './api/courses.service';
import { DefaultService } from './api/default.service';
import { GroupsService } from './api/groups.service';
import { MailService } from './api/mail.service';
import { TestService } from './api/test.service';
import { UsersService } from './api/users.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AssessmentsService,
    AssignmentsService,
    AuthenticationService,
    CourseConfigService,
    CoursesService,
    DefaultService,
    GroupsService,
    MailService,
    TestService,
    UsersService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
