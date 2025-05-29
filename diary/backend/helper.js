const generateRandomPassword = (length = 15) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pass = '';
    for (let i = 0; i < length; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
}

const generateUsername = () => {
    return Math.random().toString(36).substring(2, 20);
}

module.exports = {
    generateRandomPassword,
    generateUsername
}
