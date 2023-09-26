import { Sequelize, DataTypes, Model } from "sequelize";

export interface FollowingUsersAttributes {
  userId: string;
  target: string;

  createdAt: Date;
  updatedAt: Date;
}

export default class FollowingUsers extends Model<
  FollowingUsersAttributes,
  any
> {
  public userId!: string;
  public target!: string;

  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    FollowingUsers.belongsTo(models.User, { foreignKey: "userId" });
    FollowingUsers.belongsTo(models.User, { foreignKey: "target" });
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
      { sequelize, modelName: "FollowingUsers" }
    );
  }
}
