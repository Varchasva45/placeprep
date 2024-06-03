const baseUrl = 'http://localhost:3000';

export const authEndpoints = {
    signUp_API: baseUrl + '/auth/signup',
    login_API: baseUrl + '/auth/login',
};

export const askPDFEndpoints = {
    fetchFiles_API: baseUrl + '/askPDF/fetchFiles',
    uploadFile_API: baseUrl + '/askPDF/uploadFile'
};