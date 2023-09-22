import { Sequelize, DataTypes, Model } from "sequelize";

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

export default class Admin extends Model<AdminAttributes, any> {
  public userId!: string;
  public division!:
    | "Director"
    | "Finance"
    | "IT"
    | "Third Party"
    | "Customer Service"
    | "Marketing";
  public role!: "Supervisor" | "Manager" | "Staff";
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    Admin.belongsTo(models.User, { foreignKey: "userId" });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: "Users",
            },
            key: "UUID",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },

        division: {
          type: DataTypes.ENUM,
          values: [
            "Director",
            "Finance",
            "IT",
            "Third Party",
            "Customer Service",
            "Marketing",
          ],
          allowNull: false,
        },

        role: {
          type: DataTypes.ENUM,
          values: ["Supervisor", "Manager", "Staff"],
          allowNull: false,
        },

        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      },
      { sequelize, modelName: "Admins" }
    );
  }
}
