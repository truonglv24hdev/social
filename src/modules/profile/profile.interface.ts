export interface IProfile {
  _id: string;
  user: string;
  company: string;
  website: string;
  location: string;
  status: string;
  skills: string[];
  bio: string;
  experience: IExperience[];
  education: IEducation[];
  social: ISocial;
  following: IFollower[];
  follower: IFollower[];
  date: Date;
}

export interface IFollower {
  user: string;
  _id: string;
}

export interface IExperience {
  _id: string;
  title: string;
  company: string;
  location: string;
  from: Date;
  to: Date;
  current: boolean;
  description: string;
}

export interface IEducation {
  _id: string;
  school: string;
  degree: string;
  from: Date;
  to: Date;
  current: boolean;
  description: string;
}

export interface ISocial {
  youtube: string;
  facebook: string;
  twitter: string;
}
