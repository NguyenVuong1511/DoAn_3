export interface Education {
  id: string;
  cvId: string;
  schoolName: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  id: string;
  cvId: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface Skill {
  id: string;
  cvId: string;
  skillName: string;
  level: string;
}

export interface CV {
  id: string;
  candidateId: string;
  title: string;
  type: string;
  fileUrl: string;
  uploadDate: string;
  isDefault: boolean;
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  avatar: string;
  aboutMe: string;
  github: string;
  linkedIn: string;
  website: string;
  educations: Education[];
  experiences: Experience[];
  skills: Skill[];
}

export interface CVResponse {
  success: boolean;
  message: string;
  data: CV;
}
