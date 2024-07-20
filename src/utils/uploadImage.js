import { storage } from "./firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadImage = async (file) => {
    // console.log(file);
    const storageRef = ref(storage, `images/${file.name}`);
    const response = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(response.ref);
    return downloadURL;
};  