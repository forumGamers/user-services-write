import { Sequelize, DataTypes, Model } from "sequelize";

export interface BalanceAttributes {
  userId: string;
  balance: number;
  point: number;

  createdAt: Date;
  updatedAt: Date;
}

export default class Balance extends Model<BalanceAttributes, any> {
  userId!: string;
  balance!: number;
  point!: number;
  createdAt!: Date;
  updatedAt!: Date;

  public static associate(models: any) {
    Balance.belongsTo(models.User, { foreignKey: "userId" });
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
        balance: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },

        point: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
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
      { sequelize, modelName: "Balances" }
    );
  }
}
