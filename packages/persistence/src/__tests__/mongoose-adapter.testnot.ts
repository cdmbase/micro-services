import { MongooseAdapter, MongooseAdapterOptions } from '../impl';

import * as Mongoose from 'mongoose';

import 'jest';

describe('Mongoose adapter test', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
    const options: MongooseAdapterOptions = {
        uri: 'mongodb://localhost:27017',
    };
    let mongoAdapter: MongooseAdapter;
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

    beforeAll(() => {
        mongoAdapter = new MongooseAdapter({
            uri: process.env.MONGO_HOST || 'mongodb://localhost:27017',
        });
    });

    afterAll(() => {
        mongoAdapter.destroy();
    });


    it('check the mongo adaptee', async () => {
        await mongoAdapter.initialize();
        expect(mongoAdapter.adaptee).toBeInstanceOf(Mongoose.Connection);
    });

    // it('check the mongo model', async () => {
    //     console.log(mongoAdapter.adaptee.useDb('test').model('test'));
    //     expect(mongoAdapter.adaptee).toBeInstanceOf(Mongoose.Connection);
    // });

});
