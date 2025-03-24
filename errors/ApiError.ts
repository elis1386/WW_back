import _ from 'lodash';

export class ApiError {
  constructor(
    public code: number,
    public message: string
  ) {
    this.code = code;
    this.message = message;
  }

  static resourceNotFound(msg: string) {
    return new ApiError(404, msg);
  }

  static forbidden(msg: string) {
    return new ApiError(403, msg);
  }

  static badRequest(msg: string) {
    return new ApiError(400, msg);
  }

  static internal(msg: string, errorToLog: Error | unknown) {
    // Log the error to the console so that we could know what went wrong.
    console.log("Internal error happened!\nHere's the error message:");
    console.log(
      _.get(
        errorToLog,
        'message',
        `Failed to get error message, so here's the whole error object:\n${JSON.stringify(
          errorToLog
        )}`
      )
    );
    return new ApiError(500, msg);
  }
}
