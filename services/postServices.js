import axios from '../setup/axios'; // Import Axios instance đã được cấu hình

const createNewPost = async (post) => {
    try {
        console.log(post.userId, post.content, post.imageUrl);
        const response = await axios.post('/posts', post);
        return response.data;
    } catch (error) {
        console.error('Failed to create post:', error.response?.data || error.message);
        throw error;
    }
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


const getPostByUserId = async (userId) => {
    try {
        // Input validation
        if (!userId) {
            throw new Error('User ID is required');
        }

        console.log(`Fetching posts for user: ${userId}`);
        const response = await axios.get(`/posts/user/${userId}`);

        // Log success
        console.log(`Successfully fetched ${response.data?.result?.length || 0} posts for user ${userId}`);

        return response.data;
    } catch (error) {
        // Log error details
        console.error(`Failed to fetch posts for user ${userId}:`, error.response?.data || error.message);
        throw error;
    }
};


const getPostLikeStatus = async (postId, userId) => {
    try {
        const response = await axios.get(`/posts/${postId}/like/status`, {
            params: {
                userId
            }
        });
        return response.data.result;
    } catch (error) {
        console.error(`Failed to check like status for post ${postId} and user ${userId}:`, error.response?.data || error.message);
        throw error;
    }
};

const likePost = async (postId, userId) => {
    try {
        // Input validation
        if (!postId || !userId) {
            throw new Error('Post ID and User ID are required');
        }

        console.log(`Liking post: ${postId} by user: ${userId}`);
        const response = await axios.put(`/posts/${postId}/like`, null, {
            params: {
                userId
            }
        });

        // Log success
        console.log(`Successfully liked post ${postId}`);
        return response.data;
    } catch (error) {
        // Log error details
        console.error(`Failed to like post ${postId}:`, error.response?.data || error.message);
        throw error;
    }
};

const unlikePost = async (postId, userId) => {
    try {
        // Input validation
        if (!postId || !userId) {
            throw new Error('Post ID and User ID are required');
        }

        console.log(`Unliking post: ${postId} by user: ${userId}`);
        const response = await axios.delete(`/posts/${postId}/like`, {
            params: {
                userId
            }
        });

        // Log success
        console.log(`Successfully unliked post ${postId}`);
        return response.data;
    } catch (error) {
        // Log error details
        console.error(`Failed to unlike post ${postId}:`, error.response?.data || error.message);
        throw error;
    }
};

export { createNewPost, updatePost, deletePost, getAllPosts, getPostById, getPostByUserId, likePost, unlikePost, getPostLikeStatus };