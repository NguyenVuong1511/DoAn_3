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
}

export const getCandidateInterviewsApi = async (userId: string) => {
  const response = await axiosInstance.get(`/interviews/candidate/${userId}`);
  return response.data;
};

export const getApplicationInterviewsApi = async (applicationId: string) => {
  const response = await axiosInstance.get(`/interviews/application/${applicationId}`);
  return response.data;
};
