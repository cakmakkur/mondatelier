import type { ProfileTypes } from "./ProfileTypes";
import type { UserTypes } from "./UserTypes";

export interface SignupDto {
  email: string;
  password: string;
  userType: UserTypes;
  firstname: string;
  lastname: string;
  profileName: string;
  dob: Date;
  country: string;
  showRealName: boolean;
  profileType: ProfileTypes;
}
