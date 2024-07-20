import { Cloudinary } from "@cloudinary/url-gen/index";

export const cloudinary = new Cloudinary({
    cloud: {
        cloud_name: 'ddkqtrg8f', secure: true
    }
});

export const Upload = async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'vx9ujben');
    formData.append('folder', folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/ddkqtrg8f/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    return await response.json();
};
