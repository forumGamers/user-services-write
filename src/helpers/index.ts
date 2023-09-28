export default class Helper {
  public static userStatus(as: "Admin" | "Seller" | "User") {
    switch (as) {
      case "Admin":
        return "Admins";
      case "Seller":
        return "Sellers";
      default:
        return "Users";
    }
  }
}
