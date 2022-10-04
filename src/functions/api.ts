import config from "../config"
import ky, {HTTPError, Options, ResponsePromise} from "ky"
import {z} from "zod";
import {IAuth, useRenewal} from "../pages/Auth/AuthContext";
import {NormalizedOptions} from "ky/distribution/types/options";
import {PagesError} from "./error";

const api = ky.create({prefixUrl: config.api_location});

export const back_post = async (endpoint: string, json: Object, options?: Options) => {
    return await api.post(endpoint, {json: json, ...options}).json()
}

const renewHook = (auth: IAuth) => {
    return async (request: Request, options: NormalizedOptions, response: Response) => {
        const {error, error_description, debug_key = ""} = await response.json()

        if (debug_key === "expired_access_token") {
            const newState = await useRenewal(auth.authState)

            auth.setAuthState(newState)

            if (newState.isAuthenticated) {
                request.headers.set('Authorization', `Bearer ${newState.access}`)

                return api(request);
            }
        }
    }
}

export const back_post_auth = async (endpoint: string, json: Object, auth: IAuth, options?: Options) => {
    const bearer = 'Bearer ' + auth.authState.access

    return await api.post(endpoint, {
        json: json,
        headers: {
            'Authorization': bearer,
        },
        hooks: {
            afterResponse: [
                renewHook(auth)
            ]
        },
        ...options
    }).json()
}

export const back_request = async (endpoint: string, auth: IAuth, options?: Options) => {
    const bearer = 'Bearer ' + auth.authState.access
    return await api.get(endpoint, {
        headers: {
            'Authorization': bearer,
        },
        hooks: {
            afterResponse: [
                renewHook(auth)
            ]
        },
        ...options
    }).json()
}

const Profile = z.object({
    username: z.string(),
    scope: z.string(),
})
type Profile = z.infer<typeof Profile>;

export const profile_request = async (auth: IAuth, options?: Options) => {
    let response = await back_request('res/profile/', auth, options)
    const profile: Profile = Profile.parse(response)
    return profile
}

const SignedUp = z.object({
    firstname: z.string(),
    lastname: z.string(),
    phone: z.string(),
    email: z.string()
})
export type SignedUp = z.infer<typeof SignedUp>;

const SignedUps = z.array(SignedUp)
type SignedUps = z.infer<typeof SignedUps>;

export const su_request = async (auth: IAuth, options?: Options) => {
    let response = await back_request('onboard/get/', auth, options)
    const sus: SignedUps = SignedUps.parse(response)
    return sus
}

const UserData = z.object({
    firstname: z.string(),
    lastname: z.string(),
    phone: z.string(),
    email: z.string(),
    user_id: z.string(),
    callname: z.string(),
    av40id: z.number(),
    joined: z.string(),
    eduinstitution: z.string(),
    birthdate: z.string(),
    registered: z.boolean()
})
export type UserData = z.infer<typeof UserData>;

const UsersData = z.array(SignedUp)
type UsersData = z.infer<typeof SignedUps>;

export const ud_request = async (auth: IAuth, options?: Options) => {
    let response = await back_request('admin/users/', auth, options)
    const uds: UsersData = UsersData.parse(response)
    return uds
}

const ApiError = z.object({
    error: z.string(),
    error_description: z.string(),
    debug_key: z.string()
})
export type ApiError = z.infer<typeof ApiError>;

export const catch_api = async (e: unknown): Promise<ApiError> => {
    if (e instanceof HTTPError) {
        const err_json = await e.response.json()
        return ApiError.parse(err_json)
    } else {
        throw e
    }
}

export const err_api = async (e: unknown) => {
    const err = await catch_api(e)
    return new PagesError(err.error, err.error_description, err.debug_key)
}