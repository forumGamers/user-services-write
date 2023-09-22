import { QueryInterface } from "sequelize";
import { v4 } from "uuid";

export = {
  up: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: false,
        type: Sequelize.INTEGER,
      },
      fullname: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
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
        type: Sequelize.UUID,
        defaultValue: v4(),
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
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
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      bio: {
        type: Sequelize.TEXT,
        defaultValue: "",
      },
      imageUrl: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      backgroundUrl: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "nonActive"],
        defaultValue: "active",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.dropTable("Users");
  },
};
