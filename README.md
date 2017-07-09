# @micro-services Packages

*Micro-services packages to support micro backend services

## Introduction

This library extends the `bunyan` npm with factories to create Logger instances:

1. @micro-services/core: Core abstractors that will be used in other packages
2. @micro-services/persistence: Provides abstract classess to work with Sequelizer and Mongoose
3. @micro-services/amqp: TODO

## Consumed Libraries

 [bunyan](https://github.com/trentm/node-bunyan)

## Contributing

### Getting started

Install `node_modules` via `npm`
```
npm i
```

Build the project (using typescript compiler)
```
npm run lerna