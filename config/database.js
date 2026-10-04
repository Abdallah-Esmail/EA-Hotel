import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "Hotel",
  process.env.DB_USER || "sa",
  process.env.DB_PASS || "pass12",
  {
    host: "127.0.0.1",
    dialect: "mssql",
    dialectOptions: {
      options: {
        instanceName: "SQLEXPRESS",
        encrypt: false,
        trustServerCertificate: true,
      },
    },
    logging: console.log,
  },
);

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to SQL Server successfully");
  } catch (error) {
    console.error("Unable to connect to SQL Server:", error.message);
    process.exit(1);
  }
};

export { sequelize };
export default dbConnection;
