

export type SignUpData = {
    name : string,
    email : string,
    password : string
}

export type LoginData = {
    email : string,
    password : string
}

export type User = {
    id : number,
    name : string,
    email : string,
}

export type Zap = {
    availableTriggerId : string,
    triggerMetadata: {},
    actions : Action[],
}

export type Action = {
    availableActionId : string,
    availableMetadata : {},
}

export type getZaps = {
    id : string,
    triggerId : string,
    userId : string,
    trigger : Trigger,
    action : ActionData[],
    createdAt : string,
}

type ActionData = {
    actionId : string,
    metadata : {},
    zapId : string,
    type : {
        id : string,
        name : string,
        image : string,
    }
}
type Trigger = {
    triggerId : string,
    type : {
        id : string,
        name : string,
        image : string,
    }
}

