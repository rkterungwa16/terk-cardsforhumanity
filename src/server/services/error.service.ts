export class CustomError extends Error {
  public statusCode: number;
  public message: string;
  public name: string;
  constructor() {
    super();
    this.statusCode = 500;
    this.message = "";
    this.name = "";
  }
}

export const errorFactory = (Error: CustomError) => {
  return (statusCode: number, message: string, name: string): CustomError => {
    Error.message = message;
    Error.statusCode = statusCode;
    Error.name = name;
    return Error;
  };
};

export const error = errorFactory(new CustomError());

/**
 * Creates a CustomError with the specified status code, message, and name
 *
 * @param statusCode HTTP status code for the error (default: 500)
 * @param message Error message (default: "Internal Server Error")
 * @param name Error name/type (default: "ServerError")
 * @returns CustomError instance
 */
export const createError = (
  statusCode: number = 500,
  message: string = "Internal Server Error",
  name: string = "ServerError",
): CustomError => {
  const customError = new CustomError();
  customError.statusCode = statusCode;
  customError.message = message;
  customError.name = name;
  return customError;
};
