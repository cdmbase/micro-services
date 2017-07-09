import * as Sequelize from 'sequelize';
import * as Logger from 'bunyan';

export interface ConnectionOptions {
  database: string;
  username: string;
  password?: string;
  options?: Sequelize.Options;
}
export interface SequelizeAdapterOptions {
  uri?: string;
  connectionOptions?: ConnectionOptions;
}
