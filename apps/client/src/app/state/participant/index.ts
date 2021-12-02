import * as _ParticipantActions from "./participant.actions";
import * as _ParticipantSelectors from "./participant.selectors";

import * as GroupActions from "./groups/groups.actions";
import * as GroupSelectors from "./groups/groups.selectors";

import * as AssessmentActions from "./assessments/assessments.actions";
import * as AssessmentSelectors from "./assessments/assessments.selectors";

import * as AdmissionStatusActions from "./admission-status/admission-status.actions";
import * as AdmissionStatusSelectors from "./admission-status/admission-status.selectors";

export const ParticipantActions = {
	..._ParticipantActions,
	...GroupActions,
	...AssessmentActions,
	...AdmissionStatusActions
};

export const ParticipantSelectors = {
	..._ParticipantSelectors,
	...GroupSelectors,
	...AssessmentSelectors,
	...AdmissionStatusSelectors
};
