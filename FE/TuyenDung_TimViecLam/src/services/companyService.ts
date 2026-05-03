import axiosInstance from './axiosInstance';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  website?: string;
  description?: string;
  isVerified: boolean;
  industry?: string;
  size?: string;
  phone?: string;
  email?: string;
  cover?: string;
  culture?: string;
  benefits?: string;
}

export const getMyCompanyApi = async (userId: string) => {
  const response = await axiosInstance.get(`/companies/my-company/${userId}`);
  return response.data;
};

export const updateCompanyApi = async (company: Company) => {
  const response = await axiosInstance.put('/companies', company);
  return response.data;
};

export const getCompanyByIdApi = async (id: string) => {
  const response = await axiosInstance.get(`/companies/${id}`);
  return response.data;
};

export const uploadCompanyLogoApi = async (companyId: string, file: File) => {
  const formData = new FormData();
  formData.append('companyId', companyId);
  formData.append('file', file);

  const response = await axiosInstance.post('/api/Upload/company-logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadCompanyCoverApi = async (companyId: string, file: File) => {
  const formData = new FormData();
  formData.append('companyId', companyId);
  formData.append('file', file);

  const response = await axiosInstance.post('/api/Upload/company-cover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
