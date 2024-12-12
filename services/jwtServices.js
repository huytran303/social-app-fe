import * as jose from 'jose'

const extractUserIdFromToken = async (token, secretKey) => {
    console.log('checking token:', token)
    console.log('checking secretKey:', secretKey)

    if (!secretKey) {
        console.error('Secret key is undefined')
        return null
    }

    try {
        // Sử dụng jose để verify token tương thống với backend Nimbus
        const secretKeyBuffer = new TextEncoder().encode(secretKey)
        const { payload } = await jose.jwtVerify(token, secretKeyBuffer)

        console.log('Decoded payload:', payload)

        // Trả về userId từ payload
        return payload.userId || null
    } catch (error) {
        console.log('Error decoding token:', error)
        return null
    }
}

export { extractUserIdFromToken }