import { Attachment } from "./Attachment";

export interface User {
  user_id?: number,
  username: string,
  password: string,
  isLogged: boolean,
  photo?: Attachment[]

}
