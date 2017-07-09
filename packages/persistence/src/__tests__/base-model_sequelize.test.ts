import 'jest';
import * as Sequelize from 'sequelize';
import {SequelizeAdapter, SequelizeAdapterOptions } from '../impl';
import { BaseModel } from '../base-model';

describe('Sequelize adapter test', () => {
    let mysqlAdapter: SequelizeAdapter;
    const mysqlOptions = {
        connectionOptions: {
            database: 'test', username: 'root', password: 'welcome1',
            options: {
                dialect: 'mysql',
                pool: {
                    max: 5,
                    min: 0,
                    idle: 100,
                },
            },
        },
    };
    const fields = {
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            set(val) {
                this.setDataValue('title', val.toUpperCase());
            },
        },
    };

    class TestModel extends BaseModel {

        protected name = 'testTable';

        protected fields = fields;

        constructor(adapter: SequelizeAdapter) {
            super(adapter);
        }

    }

    beforeAll(async () => {
        mysqlAdapter = new SequelizeAdapter(mysqlOptions);
        await mysqlAdapter.initialize();
    });

    afterAll(() => {
        mysqlAdapter.destroy();
    });


    it('check the mysql adaptee', async () => {
        const testModel = new TestModel(mysqlAdapter);
        const orm = await testModel.ORM as Sequelize.Model<any, any>;
        await orm.create({
            title: 'Testing Title',
        });


    });
});
