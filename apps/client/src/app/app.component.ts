import { Component } from "@angular/core";
import { JwksValidationHandler, OAuthService } from "angular-oauth2-oidc";
import { authCodeFlowConfig } from "libs/util/auth/src/lib/auth-config";

@Component({
    selector: "student-mgmt-client-root",
    templateUrl: "./app.component.html",
    standalone: false
})
export class AppComponent {
    constructor(private readonly oauthService: OAuthService){
        this.configureOIDC()
      }

    configureOIDC(){
        this.oauthService.configure(authCodeFlowConfig)
        this.oauthService.loadDiscoveryDocumentAndTryLogin()
        this.oauthService.setupAutomaticSilentRefresh()
      }
}
