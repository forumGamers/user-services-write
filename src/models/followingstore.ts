import { Sequelize, DataTypes, Model } from "sequelize";

export interface FollowingStoreAttributes {
  userId: string;
  target: string;

  createdAt: Date;
  updatedAt: Date;
}

export default class FollowingStores extends Model<
  FollowingStoreAttributes,
  any
> {
  public userId!: string;
  public target!: string;

  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    FollowingStores.belongsTo(models.User, { foreignKey: "userId" });
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
        target: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "target is required",
            },
            notNull: {
              msg: "target is required",
            },
          },
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
      { sequelize, modelName: "FollowingStores" }
    );
  }
}
