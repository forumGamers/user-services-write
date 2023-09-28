import { Sequelize, DataTypes, Model } from "sequelize";
import { SellerAttributes } from "../interfaces/seller";

export default class Seller extends Model<SellerAttributes, any> {
  createdAt!: Date;
  updatedAt!: Date;

  StoreId!: string;
  userId!: string;

  public static associate(models: any) {
    Seller.belongsTo(models.User, { foreignKey: "userId" });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        StoreId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
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
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      },
      { modelName: "Sellers", sequelize }
    );
  }
}
