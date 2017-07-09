import * as Sequelize from 'sequelize';


let attributes = {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^[a-z0-9\_\-]+$/i,
        },
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true,
        },
    },
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
    salt: {
        type: Sequelize.STRING,
    },
};

let options = {
    freezeTableName: true,
};

describe('Sequelize adapter test', async () => {

    let user: Sequelize.Model<any, any>;
    let connection: Sequelize.Sequelize;
    beforeAll(() => {
        connection = new Sequelize('test', 'root', 'welcome1',
            {
                dialect: 'mysql',
                pool: {
                    max: 5,
                    min: 0,
                    idle: 100,
                },
            });
        user = connection.define('users', attributes, options);

    });

    it('Test Sequelize connection', (done) => {
        connection.authenticate().then(function (err) {
            console.log('Connection has been established successfully.');
            done();
        })
            .catch((err) => {
                console.log('Unable to connect to the database:', err);
            });
    });

    it('Test user', async () => {
        await user.sync({ force: true });
        await user.create({
            username: 'user',
            password: 'sdfsfs',
        });
    });
});



