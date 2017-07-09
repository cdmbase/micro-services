export type ErrorType = 'EXPECTED' | 'LOGIC' | 'FATAL' | 'ETC';

export class AbstractError extends Error {
  public statusCode: number;
  public errorCode: string;
  public errorKey: string;
  public result: boolean;
  public reason: string;

  public stack: any;
  public extra: any;
  public occuredIn: string;
  public tattoo: string;

  constructor(public errorType: ErrorType,
    public errorNumber: number,
    public debugMsg: string,
    public islandName: string,
    enumObj: any) {
    super(`code: ${islandName}.${errorType}.${enumObj[errorNumber]}, msg: ${debugMsg}'`);
    this.errorKey = enumObj[errorNumber];
    this.errorCode = `${islandName}.${errorType}.${enumObj[errorNumber]}`;
    this.reason = debugMsg;
    this.result = false;
    this.extra = this.extra || { island: islandName };
  }
}

export class AbstractExpectedError extends AbstractError {
  constructor(errorNumber: number,
    debugMsg: string,
    islandName: string,
    enumObj: any) {
    super('EXPECTED', errorNumber, debugMsg || '', islandName, enumObj);
    this.name = 'ExpectedError';
  }
}

export class AbstractLogicError extends AbstractError {
  constructor(errorNumber: number,
    debugMsg: string,
    islandName: string,
    enumObj: any) {
    super('LOGIC', errorNumber, debugMsg || '', islandName, enumObj);
    this.name = 'LogicError';
  }
}

export class AbstractFatalError extends AbstractError {
  constructor(errorNumber: number,
    debugMsg: string,
    islandName: string,
    enumObj: any) {
    super('FATAL', errorNumber, debugMsg || '', islandName, enumObj);
    this.name = 'FatalError';
  }
}

export class LogicError extends AbstractLogicError {
  constructor(errorNumber: ISLAND.LOGIC, debugMsg?: string) {
    super(errorNumber, debugMsg || '', 'ISLAND', ISLAND.LOGIC);
  }
}

export class FatalError extends AbstractFatalError {
  constructor(errorNumber: ISLAND.FATAL, debugMsg?: string) {
    super(errorNumber, debugMsg || '', 'ISLAND', ISLAND.FATAL);
  }
}

export namespace ISLAND {
  export enum LOGIC {
    L0001_PLAYER_NOT_EXIST = 1,
    L0002_WRONG_PARAMETER_SCHEMA = 2,
    L0003_NOT_INITIALIZED_EXCEPTION = 3,
    L0004_MSG_PACK_ERROR = 4,
    L0005_MSG_PACK_ENCODE_ERROR = 5,
    L0006_HANDLE_MESSAGE_ERROR = 6,
  }

  export enum FATAL {
    F0001_ISLET_ALREADY_HAS_BEEN_REGISTERED = 1,
    F0002_DUPLICATED_ADAPTER = 2,
    F0003_MISSING_ADAPTER = 3,
    F0004_NOT_IMPLEMENTED_ERROR = 4,
    F0008_AMQP_CHANNEL_POOL_REQUIRED = 8,
    F0011_NOT_INITIALIZED_EXCEPTION = 11,
    F0012_ROUND_ROBIN_EVENT_Q_IS_NOT_DEFINED = 12,
    F0013_NOT_INITIALIZED = 13,
    F0015_TAG_IS_UNDEFINED = 15,
    F0016_SCOPE_CONTEXT_ERROR = 16,
    F0018_ERROR_COLLECTING_META_DATA = 18,
    F0019_NOT_IMPLEMENTED_ERROR = 19,
    F0020_NOT_INITIALIZED_EXCEPTION = 20,
    F0021_NOT_IMPLEMENTED_ERROR = 21,
    F0022_NOT_INITIALIZED_EXCEPTION = 22,
    F0023_RPC_TIMEOUT = 23,
    F0024_ENDPOINT_METHOD_REDECLARED = 24,
    F0025_MISSING_ADAPTER_OPTIONS = 25,
    F0026_MISSING_REPLYTO_IN_RPC = 26,
    F0027_CONSUMER_IS_CANCELED = 27,
  }
}
