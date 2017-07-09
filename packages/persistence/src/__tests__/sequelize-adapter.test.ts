import 'jest';
import * as Sequelize from 'sequelize';
import { SequelizeAdapter, SequelizeAdapterOptions } from '../impl';


describe('Sequelize adapter test', () => {
    let mysqlAdapter: SequelizeAdapter;
    let sqliteAdapter: SequelizeAdapter;
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

    const sqliteOptions = {
        connectionOptions: {
            database: 'test',
            username: '',
            password: '',
            options: {
                dialect: 'sqlite',
                pool: {
                    max: 5,
                    min: 0,
                    idle: 100,
                },
                storage: 'test-db.sqlite3',
            },
        },
    };

    const sqliteMemoryOptions = {
        connectionOptions: {
            database: 'mydatabase',
            username: '',
            password: '',
            options: {
                dialect: 'sqlite',
                logging: false,
                forceSync: false,
            },
        },
    };

    beforeAll(() => {
        sqliteAdapter = new SequelizeAdapter(sqliteOptions);
        mysqlAdapter = new SequelizeAdapter(mysqlOptions);
    });

    afterAll(() => {
        mysqlAdapter.destroy();
        sqliteAdapter.destroy();
    });

    it('check the mysql adaptee', async () => {
        await mysqlAdapter.initialize();
        expect(mysqlAdapter.adaptee).toBeTruthy;
    });

    // currently fails, need fix
    // it('check the sqlite adaptee', async () => {
    //     await sqliteAdapter.initialize();
    //     // console.log(sequelizeAdapter.adaptee);
    //     expect(sqliteAdapter.adaptee).toBeInstanceOf(Sequelize.Sequelize);
    // });
});
