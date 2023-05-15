export interface registerInteface {
    name: string,
    email: string,
    id: string,
    authToken: string,
}

export interface loginInterface {
    email: string,
    name: string,
    id: string,
    authToken: string,
    cookiePaylad: any,
    profileImage: string,
    location: string
}

export interface loginControllerInterface {
    email: string,
    name: string,
    id: string,
    authToken: string,
    profileImage: string,
    location: string
}