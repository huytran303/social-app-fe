import axios from '../setup/axios'; // Import Axios instance đã được cấu hình

const createNewPost = (userId, content, imageUrl) => {
    console.log(userId, content, imageUrl);
    return axios.post('/posts', {
        userId, content, imageUrl
    });
};

const updatePost = (postId, content, imageUrl) => {
    console.log(postId, content, imageUrl);
    return axios.put(`/posts/${postId}`, {
        content, imageUrl
    });
};

const deletePost = (postId) => {
    console.log(postId);
    return axios.delete(`/posts/${postId}`);
};

const getAllPosts = () => {
    console.log('Fetching all posts');
    return axios.get('/posts');
};

const getPostById = (postId) => {
    console.log(postId);
    return axios.get(`/posts/${postId}`);
};

export { createNewPost, updatePost, deletePost, getAllPosts, getPostById };
