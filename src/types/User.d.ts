import { History } from "./History";

export interface User {
  email: string;
  password: string;
  histroy: History[];
}
