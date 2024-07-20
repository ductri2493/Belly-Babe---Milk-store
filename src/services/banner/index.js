import { instance } from '../instance'

export const getBanners = async () => {
    try {
        // console.log(instance)
        const fetch = await instance.get(`banner`)
        // console.log(fetch)
        return fetch;
    }
    catch (error) {
        console.log(error)
    }
}