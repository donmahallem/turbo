/**
 * Package @donmahallem/turbo
 * Source https://github.com/donmahallem/turbo
 */

import { IErrorResponse } from './error-response.js';
import { promiseToResponse } from './promise-to-response.js';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

type MethodInterface<T> = (req?: Request, res?: Response<T>) => Promise<T>;

/**
 * Does create an request handler that transforms a provided promise
 * into an response
 * @param prom a promise to handle
 */
export const promiseRequestHandler: <T>(prom: MethodInterface<T>) => RequestHandler =
    <T>(prom: MethodInterface<T>): RequestHandler =>
    (req: Request, res: Response<T | IErrorResponse>, next: NextFunction): void => {
        promiseToResponse(prom(req, res), res, next);
    };
