const baseUrl = import.meta.env.VITE_BASE_URL;

export const authEndpoints = {
  signUp_API: baseUrl + "/api/auth/signup",
  login_API: baseUrl + "/api/auth/login",
  sendOtp_API: baseUrl + "/api/auth/send-otp",
  updatePassword_API: baseUrl + "/api/auth/password",
};

export const userEndpoints = {
  fetchUserDetails_API: baseUrl + "/api/users",
  fetchSubmissions_API: baseUrl + "/api/users/submissions",
  fetchDiscussions_API: baseUrl + "/api/users/discussions",
  updateUserDetails_API: baseUrl + "/api/users",
  updateUsername_API: baseUrl + "/api/users/username",
  updateEmail_API: baseUrl + "/api/users/email",
};

export const askPDFEndpoints = {
  createFile_API: baseUrl + "/api/askPDF/files/create",
  fetchFiles_API: baseUrl + "/api/askPDF/files/fetchFiles",
  deleteFile_API: baseUrl + "/api/askPDF/files",
  fetchFileDetails_API: baseUrl + "/api/askPDF/files",
  fetchFileStatus_API: baseUrl + "/api/askPDF/files/status",
  fetchFileMessages_API: baseUrl + "/api/askPDF/files/messages",
  createFileMessage_API: baseUrl + "/api/askPDF/files/messages",
  vectorizeFile_API: baseUrl + "/api/askPDF/files/vectorize",
};

export const chatBotEndpoints = {
  fetchMessages_API: baseUrl + "/api/chatbot/messages",
  sendMessage_API: baseUrl + "/api/chatbot/message",
};
