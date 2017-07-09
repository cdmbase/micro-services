/**
 * BaseModel
 *
 * Abstract class with all common models methods
 */
import * as Sequelize from 'sequelize';

import * as Mongoose from 'mongoose';

import SequelizeAdapter from './impl/sequelize-adapter';
import MongooseAdapter from './impl/mongoose-adapter';
import { IAbstractAdapter } from '@micro-services/core';

export abstract class BaseModel {

    constructor(private _adapter) {

    }

    /**
     * debug
     *
     * @type {boolean} debug activate the debug
     * @protected
     */
    public debug: boolean = false;

    /**
     * name
     *
     * @type {string} _name the name of the model
     * @protected
     */
    protected abstract name: string;

    /**
     * fields
     *
     * @type {Schema} _fields a MongoDB Schema
     * @type {Object} _fields a Sequelize model object
     * @protected
     */
    protected abstract fields: {};

    /**
     * ORM
     *
     * An instance of current ORM
     * @private
     */
    private _ORM: Sequelize.Model<{}, {}> | Mongoose.Model<Mongoose.Document>;

    /**
     * get ORM
     *
     * Initialize the Sequelize or Mongoose and return the ORM
     */
    public get ORM(): Promise<Sequelize.Model<{}, {}> | Mongoose.Model<Mongoose.Document>> {
        if (this._adapter instanceof SequelizeAdapter) {
            return this.getSequelize();
        } else if (this._adapter instanceof MongooseAdapter) {
            return this.getMongoose();
        } else {
            throw new Error('Database Adapter missing!');
        }
    }

    /**
     * getSequelize
     *
     * get the sequilze ORM
     * @private
     */
    private async getSequelize(): Promise<Sequelize.Model<{}, {}>> {

        if (this._ORM) {
            return this._ORM as Sequelize.Model<{}, {}>;
        }

        // a new sequelize instance
        let sequelize: Sequelize.Sequelize;

        // try do connect to the database
        try {

            // set sequelize configurations
            sequelize = this._adapter.adaptee;

            // define a new model
            this._ORM = sequelize.define(this.name, this.fields);

            // sync with the db
            return this._ORM = await this._ORM.sync();
        } catch (e) {
            // show the error
            console.error(e);
        }
    }

    /**
     * getMongoose
     *
     * get the mongoose ORM
     * @private
     */
    private async getMongoose(): Promise<Mongoose.Model<Mongoose.Document>> {

        if (this._ORM) {
            return this._ORM as Mongoose.Model<Mongoose.Document>;
        }
        let mongoose: Mongoose.Connection;
        // a new instance of the MongoDB Schema
        let schema = new Mongoose.Schema(this.fields, { versionKey: '' });
        // Trying to create anew MongoDB Model
        try {
            // set mongoose configurations
            mongoose = this._adapter.adaptee;

            // check if the model already exists
            if (mongoose.model(this.name)) {
                return this._ORM = await mongoose.model(this.name);
            }
        } catch (e) {

            // if model doesn't exists
            if (e.name === 'MissingSchemaError') {
                return this._ORM = await mongoose.model(this.name, schema);
            }
        }
    }
}
