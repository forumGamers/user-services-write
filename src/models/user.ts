import { Sequelize, DataTypes, Model } from "sequelize";
import { HookReturn } from "sequelize/types/hooks";
import encryption from "../helpers/encryption";
import { UserAttributes } from "../interfaces/user";

export default class User extends Model<UserAttributes, any> {
  public fullname!: string;
  public username!: string;
  public UUID!: string;
  public email!: string;
  public password!: string;
  public isVerified!: boolean;
  public bio!: string;
  public imageUrl!: string;
  public imageId!: string;
  public backgroundUrl!: string;
  public backgroundId!: string;
  public status!: "active" | "nonActive";
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associate(models: any) {
    User.hasOne(models.Admin, { foreignKey: "userId" });
    User.hasOne(models.Seller, { foreignKey: "userId" });
  }

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        fullname: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "fullname is required",
            },
            notNull: {
              msg: "fullname is required",
            },
          },
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: {
              msg: "username is required",
            },
            notNull: {
              msg: "username is required",
            },
          },
        },
        UUID: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "email is required",
            },
            notNull: {
              msg: "email is required",
            },
            isEmail: {
              msg: "invalid email format",
            },
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            len: {
              args: [8, 16],
              msg: "password minimum characters are 8",
            },
            notNull: {
              msg: "password is required",
            },
            notEmpty: {
              msg: "password is required",
            },
          },
        },
        isVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },

        bio: {
          type: DataTypes.TEXT,
          defaultValue: "",
        },

        imageUrl: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        imageId: {
          type: DataTypes.STRING,
          defaultValue: "",
        },

        backgroundUrl: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        backgroundId: {
          type: DataTypes.STRING,
          defaultValue: "",
        },

        status: {
          type: DataTypes.ENUM,
          values: ["active", "nonActive"],
          defaultValue: "active",
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
      {
        sequelize,
        modelName: "Users",
        hooks: {
          beforeCreate: (user, options): HookReturn => {
            user.password = encryption.hash(user.password);
          },
        },
      }
    );
  }
}
