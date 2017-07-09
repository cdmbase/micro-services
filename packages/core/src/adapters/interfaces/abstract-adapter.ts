/**
 * IAbstractAdapter
 * @interface
 */
export interface IAbstractAdapter {
    adaptee: any;
    initialize(): any | Promise<any>;
    destroy(): any | Promise<any>;
}
