import axiosInstance from './axiosInstance';

export interface Interview {
  id: string;
  applicationId: string;
  interviewDate: string;
  location?: string;
  notes?: string;
  status: string;
  createdAt: string;
  jobTitle?: string;
  companyName?: string;
  companyLogo?: string;
  candidateName?: string;
  candidateAvatar?: string;
}

export const getCandidateInterviewsApi = async (userId: string) => {
  const response = await axiosInstance.get(`/interviews/candidate/${userId}`);
  return response.data;
};

export const getApplicationInterviewsApi = async (applicationId: string) => {
  const response = await axiosInstance.get(`/interviews/application/${applicationId}`);
  return response.data;
};

export const getInterviewsByCompanyApi = async (companyId: string) => {
  const response = await axiosInstance.get(`/interviews/company/${companyId}`);
  return response.data;
};

export const scheduleInterviewApi = async (data: { applicationId: string, interviewDate: string, location: string, notes: string }) => {
  const response = await axiosInstance.post('/interviews/schedule', data);
  return response.data;
};

export const updateInterviewApi = async (id: string, data: { interviewDate: string, location: string, notes: string }) => {
  const response = await axiosInstance.put(`/interviews/${id}`, data);
  return response.data;
};
