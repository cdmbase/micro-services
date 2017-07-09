import * as Bluebird from 'bluebird';
import * as dns from 'dns';
import * as MongodbUri from 'mongodb-uri';
import * as Mongoose from 'mongoose';

import { FatalError, ISLAND, AbstractAdapter } from '@micro-services/core';
import { MongooseAdapterOptions } from './interfaces';

/**
 * MongooseAdapter
 * @class
 * @extends AbstractAdapter
 */
export default class MongooseAdapter extends AbstractAdapter<Mongoose.Connection, MongooseAdapterOptions> {

  /**
   * Initialize the Mongoose connection.
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    return new Promise<void>((resolve, reject) => {
      if (!this.options) {
        throw new FatalError(ISLAND.FATAL.F0025_MISSING_ADAPTER_OPTIONS);
      }
      // Mongoose buffers all the commands until it's connected to the database.
      // But make sure to the case of using a external mongodb connector
      const uri = this.options.uri;
      const connectionOptions = this.options.connectionOptions;
      this.dnsLookup(uri).then((address) => {
        const connection = Mongoose.createConnection(address, connectionOptions);
        // define the promise object
        (<any>Mongoose).Promise = global.Promise;

        connection.once('open', () => {
          this._adaptee = connection;
          connection.removeAllListeners();
          resolve();
        });
        connection.once('error', (err) => {
          reject(err);
        });
      });
    });
  }

  public async destroy() {
    return await this._adaptee.close();
  }

  private async dnsLookup(uri) {
    const h = MongodbUri.parse(uri);
    await Bluebird.map(h.hosts, (async (host: { host: string }) => {
      host.host = await this.convert(host.host);
    }));
    return MongodbUri.format(h);
  }

  private async convert(host) {
    return await new Promise<string>((resolve, reject) => {
      dns.lookup(host, (err, ip) => {
        if (err) { return reject(err); }
        return resolve(ip);
      });
    });
  }
}
