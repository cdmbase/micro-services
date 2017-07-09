import * as Mongoose from 'mongoose';
import * as Logger from 'bunyan';

export interface MongooseAdapterOptions {
  uri: string;
  connectionOptions?: Mongoose.ConnectionOptions;
  logger?: Logger;
}
