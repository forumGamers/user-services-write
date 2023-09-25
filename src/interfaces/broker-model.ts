export default interface UserBroker {
  id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  is_verified: boolean;
  bio: string;
  image_url: string;
  background_url: string;
  status: "active" | "nonActive";
  created_at: Date;
  updated_at: Date;
  store_id?: string;
  division?:
    | "Director"
    | "Finance"
    | "IT"
    | "Third Party"
    | "Customer Service"
    | "Marketing"
    | null;
  role?: "Supervisor" | "Manager" | "Staff" | null;
}
