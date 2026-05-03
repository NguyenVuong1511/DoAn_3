import axiosInstance from './axiosInstance';

export interface JobApplication {
  id?: string;
  candidateId: string;
  jobPostId: string;
  cvId: string;
  applyDate?: string;
  coverLetter?: string;
  status?: string;
  cvType?: 'Online' | 'File';
  employerNote?: string;
  jobTitle?: string;
  companyName?: string;
  companyLogo?: string;
  cvTitle?: string;
}

export const applyJobApi = async (application: JobApplication) => {
  const response = await axiosInstance.post('/jobapplications/apply', application);
  return response.data;
};

export const getMyApplicationsApi = async (userId: string) => {
  const response = await axiosInstance.get(`/jobapplications/my-applications/${userId}`);
  return response.data;
};

export const checkIfAppliedApi = async (userId: string, jobPostId: string) => {
  const response = await axiosInstance.get(`/jobapplications/check/${userId}/${jobPostId}`);
  return response.data;
};

export const getApplicationsByJobApi = async (jobPostId: string) => {
  const response = await axiosInstance.get(`/jobapplications/job/${jobPostId}`);
  return response.data;
};

export const updateApplicationStatusApi = async (id: string, status: string, note?: string) => {
  const response = await axiosInstance.put(`/jobapplications/status/${id}`, { status, note });
  return response.data;
};

export const withdrawApplicationApi = async (id: string) => {
  const response = await axiosInstance.delete(`/jobapplications/withdraw/${id}`);
  return response.data;
};
