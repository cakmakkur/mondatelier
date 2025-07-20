export interface SignupDto {
  email: string;
  password: string;
  userType: number;
  firstname: string;
  lastname: string;
  profileName: string;
  dob: Date;
  country: string;
  showRealName: boolean;
}
