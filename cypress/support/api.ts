const apiBaseUrl = "http://localhost:3000";

/** Makes a request to the API to reset the database to its initial state. */
export function resetDemoDb(): void {
	cy.request("POST", `${apiBaseUrl}/demo/reset`, undefined);
}
