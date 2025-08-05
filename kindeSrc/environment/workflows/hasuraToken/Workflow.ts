import {
  onUserTokenGeneratedEvent,
  WorkflowSettings,
  WorkflowTrigger,
  accessTokenCustomClaims,
} from "@kinde/infrastructure"

// The setting for this workflow
export const workflowSettings: WorkflowSettings = {
  id: "onUserTokenGeneration",
  name: "Hasura Custom Claim",
  trigger: WorkflowTrigger.UserTokenGeneration,
  failurePolicy: {
    action: "stop",
  },
  bindings: {
    "kinde.accessToken": {}, // required to modify access token claims
    url: {}, // required for url params
  },
}

// The workflow code to be executed when the event is triggered
export default async function Workflow(event: onUserTokenGeneratedEvent) {
  const userId = event.context.user.id

  // set the types for the custom claims
  const accessToken = accessTokenCustomClaims<{
    "https://hasura.io/jwt/claims": {
      "x-hasura-user-id": string
      "x-hasura-default-role": string
      "x-hasura-allowed-roles": string[]
    }
  }>()

  const customClaim = {
    "x-hasura-user-id": userId,
    "x-hasura-default-role": "user",
    "x-hasura-allowed-roles": ["user"],
  }

  // Add the users company name to the access token
  accessToken["https://hasura.io/jwt/claims"] = customClaim
}
