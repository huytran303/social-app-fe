import axios from '../setup/axios';
import jwt from 'jsonwebtoken';
import { extractUserIdFromToken } from './jwtServices';

/**
 * Register a new user
 * @param {string} username - Username for registration
 * @param {string} password - Password for registration
 * @param {string} email - Email address
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} dob - Date of birth
 * @returns {Promise} Response from registration endpoint
 */
const registerNewUser = async (username, password, email, firstName, lastName, dob) => {
    try {
        const response = await axios.post('/users', {
            username,
            password,
            email,
            firstName,
            lastName,
            dob
        });
        console.log('Registration successful:', username);
        return response.data;
    } catch (error) {
        console.log('Registration failed:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Login user with credentials
 * @param {string} username - Username for login
 * @param {string} password - Password for login
 * @returns {Promise} Response containing auth token
 */
const loginUser = (username, password) => {
    console.log(username, password);
    return axios.post('/auth/token', {
        username, password
    });
}

/**
 * Get user profile by ID
 * @param {string} userId - User ID to fetch profile
 * @returns {Promise} Response containing user profile data
 */
const getUserProfile = async (userId) => {
    try {
        const response = await axios.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.log(`Failed to fetch profile for user ${userId}:`, error.response?.data || error.message);
        throw error;
    }
};

/**
 * Update user profile
 * @param {string} userId - User ID to update
 * @param {Object} updates - Object containing profile updates
 * @returns {Promise} Response containing updated user profile
 */

const updateUserProfile = async (userId, updates) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        if (!updates?.currentPassword) {
            throw new Error('Current password is required');
        }

        // Include bio in payload
        const payload = {
            currentPassword: updates.currentPassword,
            firstName: updates.firstName,
            lastName: updates.lastName,
            bio: updates.bio, // Add this line
            dob: updates.dob,
            password: updates.password,
            avatarUrl: updates.avatarUrl,
        };

        // Remove undefined fields
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined) {
                delete payload[key];
            }
        });

        const response = await axios.put(`/users/${userId}`, payload);
        return response.data;
    } catch (error) {
        // Error handling
        throw error;
    }
};

export {
    registerNewUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};