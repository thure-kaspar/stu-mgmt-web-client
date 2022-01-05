export function navigateToCourse(courseId: string): void {
	cy.visit(`/courses/${courseId}`);
}
