export interface TokenBroker {
  access_token: string;
  user_id: string;
  as: "User" | "Admin" | "Seller";
  created_at: Date;
  updated_at: Date;
}

export interface TokenAttributes {
  access_token: string;
  as: "User" | "Admin" | "Seller";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
