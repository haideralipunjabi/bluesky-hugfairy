type AuthForm = {
    identifier: string,
    password: string
}

type ErrorResponse = {
    error: string,
    message: string
}

type SessionGetResponse = {
    handle: string,
    did: string
}

type LoginResponse = {
    accessJwt: string,
    refreshJwt: string,
    did: string,
    handle: string
}

type ProfileGetResponse = {
    did: string,
    handle:string,
    creator: string,
    followersCount: number,
    followsCount:number,
    membersCount:number,
    postsCount:number
}

type MentionEnitity = {
    "type": string,
    "index": {
        "start": number
        "end": number
    },
    "value": string
}

type Subscriber = {
    "name": string,
    "handle": string,
    "avatar": string,
    "description": string
}