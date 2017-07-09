/**
 * AbstractController<T>
 * @abstract
 * @class
 */
export default class AbstractController<T> {
    private _server: T;

    /**
     * Connect your own controller here.
     * @constructs
     * @param {T} server
     */
    constructor(server: T) {
        this._server = server;
    }

    /**
     * @return {T}
     */
    protected get server() {
        return this._server;
    }

    /**
     * @abstract
     * @returns {Promise<void>}
     */
    public initialize(): any | Promise<any> {}

    public onInitialized(): any | Promise<any> {}

    public destroy(): any | Promise<any> {}

    public onDestroy(): any | Promise<any>  {}
}
