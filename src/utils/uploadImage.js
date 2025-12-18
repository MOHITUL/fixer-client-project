import axios from "axios";

export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const url = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_IMGBB_API_KEY}`;

    const res = await axios.post(url, formData);
    return res.data.data.url;
} 