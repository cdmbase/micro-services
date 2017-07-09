import * as Sequelize from 'sequelize';

import * as fs from 'fs';

import * as path from 'path';

import { FatalError, ISLAND, AbstractAdapter } from '@micro-services/core';

import { SequelizeAdapterOptions } from './interfaces';

/**
 * SequelizeAdapter
 * @class
 * @extends AbstractAdapter
 */
export default class SequelizeAdapter extends AbstractAdapter<Sequelize.Sequelize, SequelizeAdapterOptions> {
  /**
   * Initialize the mongoose connection.
   * @returns {Promise<void>}
   * @override
   */
  public initialize() {
    return new Promise<void>((resolve, reject) => {
      if (!this.options) {
        throw new FatalError(ISLAND.FATAL.F0025_MISSING_ADAPTER_OPTIONS);
      }
      if (this.options.uri) {
        this._adaptee = new Sequelize(this.options.uri);
        resolve();
      } else {
        if (this.options.connectionOptions.database === 'sqlite') {
          if (!this.options.connectionOptions.options || !this.options.connectionOptions.options.storage) {
            throw new Error('Storage location must be provided for sqlite');
          }
          if (!fs.existsSync(this.options.connectionOptions.options.storage)) {
            this.options.connectionOptions.options.storage.split('/')
              .slice(0, -1)
              .reduce((_path, _folder) => {
                _path += path.sep + _folder;
                if (!fs.existsSync(_path)) {
                  fs.mkdirSync(_path);
                }
                return _path;
              });
          }
        }
        this._adaptee = new Sequelize(
          this.options.connectionOptions.database,
          this.options.connectionOptions.username,
          this.options.connectionOptions.password,
          { ...this.options.connectionOptions.options });
        delete (this.options.connectionOptions.password);
        this._adaptee.authenticate().then(function (err) {
          console.log('Connection has been established successfully.');
          resolve();
        }).catch((err) => {
          reject(`Unable to connect to the database: ${err}`);
        });

      }
    });
  }

  public destroy() {
    return this._adaptee.close();
  }
}
