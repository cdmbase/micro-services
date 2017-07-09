import { IAbstractAdapter } from './abstract-adapter';
/**
 * IListenableAdapter
 * @interface
 */
export interface IListenableAdapter extends IAbstractAdapter {
    postInitialize(): any | Promise<any>;
    listen(): any | Promise<any>;
}
