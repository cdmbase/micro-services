import 'jest';
import * as Mongoose from 'mongoose';
import { MongooseAdapter, MongooseAdapterOptions } from '../impl';
import { BaseModel } from '../base-model';


describe('Sequelize adapter test', () => {
    let mongooseAdapter: MongooseAdapter;
    const mongooseOptions: MongooseAdapterOptions = {
        uri: 'mongodb://localhost:27017',
    };
    const fields = {
        name: {
            type: String,
        },
        users: {
            type: [Mongoose.Schema.Types.ObjectId],
            ref: 'User',
        },
        tasks: {
            type: [Mongoose.Schema.Types.Mixed],
        },
        color: {
            type: String,
            default: 'FFF',
        },
    };
    class TestModel extends BaseModel {
        protected name = 'testTable';

        protected fields = fields;
        constructor(adapter: MongooseAdapter) {
            super(adapter);
        }

    }

    beforeAll(async () => {
        mongooseAdapter = new MongooseAdapter(mongooseOptions);
        await mongooseAdapter.initialize();
    });

    afterAll(() => {
        mongooseAdapter.destroy();
    });


    it('check the mongoose adaptee', async () => {
        const testModel = new TestModel(mongooseAdapter);
        const orm = await testModel.ORM as Mongoose.Model<Mongoose.Document>;
        await orm.create([{
            name: 'test',
        }, {
            color: '0FF',
        }]);
    });
});
