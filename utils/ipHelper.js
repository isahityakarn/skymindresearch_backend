import os from 'os';

/**
 * Get the machine's actual network IP address
 * 
 * @returns {string} Machine's network IP address
 */
export const getMachineIp = () => {
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (loopback) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    
    return '127.0.0.1';
};

/**
 * Get the client's IP address from the request
 * Handles various proxy and forwarding scenarios
 * 
 * @param {Object} req - Express request object
 * @returns {string} Client IP address
 */
export const getClientIp = (req) => {
    // Try different methods to get the real IP address
    let ip = req.ip || 
             req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
             req.headers['x-real-ip'] || 
             req.connection?.remoteAddress || 
             req.socket?.remoteAddress ||
             req.connection?.socket?.remoteAddress ||
             '0.0.0.0';

    // Clean IPv6 format if needed (::ffff:192.168.1.1 -> 192.168.1.1)
    ip = ip.replace(/^::ffff:/, '');
    
    // If it's localhost (::1 or 127.0.0.1), get the machine's actual IP
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
        ip = getMachineIp();
    }
    
    return ip;
};

/**
 * Check if IP address is valid
 * 
 * @param {string} ip - IP address to validate
 * @returns {boolean} True if valid IP address
 */
export const isValidIp = (ip) => {
    if (!ip) return false;
    
    // IPv4 pattern
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Pattern.test(ip)) {
        const parts = ip.split('.');
        return parts.every(part => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
    }
    
    // IPv6 pattern (simplified)
    const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    return ipv6Pattern.test(ip);
};

/**
 * Get IP address type
 * 
 * @param {string} ip - IP address
 * @returns {string} 'ipv4', 'ipv6', or 'unknown'
 */
export const getIpType = (ip) => {
    if (!ip) return 'unknown';
    
    if (ip.includes('.') && /^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
        return 'ipv4';
    }
    
    if (ip.includes(':')) {
        return 'ipv6';
    }
    
    return 'unknown';
};

/**
 * Check if IP is a local/private address
 * 
 * @param {string} ip - IP address
 * @returns {boolean} True if local/private IP
 */
export const isPrivateIp = (ip) => {
    if (!ip) return false;
    
    // Clean IPv6 prefix
    const cleanIp = ip.replace(/^::ffff:/, '');
    
    // Check for localhost
    if (cleanIp === '127.0.0.1' || cleanIp === 'localhost' || cleanIp === '::1') {
        return true;
    }
    
    // Check for private ranges (IPv4)
    const privateRanges = [
        /^10\./,                    // 10.0.0.0 - 10.255.255.255
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0 - 172.31.255.255
        /^192\.168\./               // 192.168.0.0 - 192.168.255.255
    ];
    
    return privateRanges.some(range => range.test(cleanIp));
};

export default {
    getClientIp,
    getMachineIp,
    isValidIp,
    getIpType,
    isPrivateIp
};  isPrivateIp
