import { User } from "./user";
export interface Projects{
  user:User;
  id: number;
  title: string;
  details: string;
  total_target: number;
  start_time: string;
  end_time: string;
  image?: string;
  creator?: any;
}