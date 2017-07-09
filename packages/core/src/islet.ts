import * as _ from 'lodash';

import { IAbstractAdapter } from './adapters';
import { ListenableAdapter, IListenableAdapter } from './adapters';

import { FatalError, ISLAND } from './error';



/**
 * Create a new Islet.
 * @abstract
 * @class
 */
export default class Islet {
    /**
     * Retrieves a registered micro-service.
     * @returns {Microservice}
     * @static
     */
    public static getIslet(): Islet {
        return Islet.islet;
    }

    /**
     * Instantiate and run a microservice.
     * @param {Microservice} Class
     * @static
     */
    public static run(subClass: typeof Islet) {
        if (this.islet) {
            return;
        }

        // Create such a micro-service instance.
        const islet = new subClass();
        this.registerIslet(islet);

        islet.main();
        return islet.initialize();
    }

    private static islet: Islet;

    /**
     * Register the islet which is the suite of micro-service
     * @param {Islet} islet
     * @static
     */
    private static registerIslet(islet: Islet) {
        if (Islet.islet) {
            throw new FatalError(ISLAND.FATAL.F0001_ISLET_ALREADY_HAS_BEEN_REGISTERED,
                'The islet already has been registered.');
        }
        Islet.islet = islet;
    }

    /**
     * @type {Object.<string, IAbstractAdapter>} [adapters={}]
     */
    private adapters: { [name: string]: IAbstractAdapter; } = {};
    private listenAdapters: { [name: string]: IListenableAdapter } = {};
    private baseAdapters: { [name: string]: IAbstractAdapter; } = {};

    /**
     * Register the adapter.
     * @param {string} name
     * @param {IAbstractAdapter} adapter
     */
    public registerAdapter(name: string, adapter: IAbstractAdapter) {
        if (this.adapters[name]) {
            throw new FatalError(ISLAND.FATAL.F0002_DUPLICATED_ADAPTER, 'duplicated adapter');
        }
        if (adapter instanceof ListenableAdapter) {
            this.listenAdapters[name] = adapter;
        } else {
            this.baseAdapters[name] = adapter;
        }
    }

    /**
     * @param {string} name
     * @returns {typeof Adapter}
     */
    public getAdaptee<T>(name: string): T {
        if (!this.adapters[name]) {
            throw new FatalError(ISLAND.FATAL.F0003_MISSING_ADAPTER, 'Missing adapter');
        }
        return this.adapters[name].adaptee as T;
    }

    /**
     * @abstract
     */
    public main() {
        throw new FatalError(ISLAND.FATAL.F0004_NOT_IMPLEMENTED_ERROR, 'Not implemented exception.');
    }

    protected onPrepare() { }
    protected onInitialized() { }
    protected onDestroy() {
        console.log(`island service shutdown`);
    }
    protected onStarted() { }

    /**
     * @returns {Promise<void>}
     */
    private async initialize() {
        try {
            await this.onPrepare();
            await Promise.all(_.values<IAbstractAdapter>(this.adapters).map(adapter => adapter.initialize()));
            process.once('SIGTERM', this.destroy.bind(this));
            await this.onInitialized();
            const adapters = _.values<IListenableAdapter>(this.adapters)
                .filter(adapter => adapter instanceof ListenableAdapter);

            await Promise.all(adapters.map(adapter => adapter.postInitialize()));
            await Promise.all(adapters.map(adapter => adapter.listen()));

            console.log('started');
            await this.onStarted();

        } catch (e) {
            console.log('failed to initialize', e);
            process.exit(1);
        }
    }

    private async destroy() {
        console.log('Waiting for process to end');
        await Promise.all(_.map(this.listenAdapters, async (adapter: IListenableAdapter, key) => {
            console.log('destroy : ', key);
            await adapter.destroy();
        }));
        await Promise.all(_.map(this.baseAdapters, async (adapter: IAbstractAdapter, key) => {
            console.log('destroy: ', key);
            await adapter.destroy();
        }));
        await this.onDestroy();
    }
}
