export interface AdminAttributes {
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  division:
    | "Director"
    | "Finance"
    | "IT"
    | "Third Party"
    | "Customer Service"
    | "Marketing";
  role: "Supervisor" | "Manager" | "Staff";
}
