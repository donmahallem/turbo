/**
 * Package @donmahallem/turbo
 * Source https://github.com/donmahallem/turbo
 */

import { IErrorResponse } from './error-response.js';
import type { AxiosError } from 'axios';
import type { NextFunction, Response } from 'express';

type MethodType = <T>(prom: Promise<T>, res: Response, next?: NextFunction) => void;

/**
 * Awaits an promise and returns it
 * @param prom promise to convert
 * @param res the express.Response to use
 * @param next (optional) response object
 */
export const promiseToResponse: MethodType = <T>(prom: Promise<T>, res: Response<T | IErrorResponse>, next?: NextFunction): void => {
    prom.then((value: T): void => {
        (res.headersSent ? res : res.status(200)).json(value);
    })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any): void => {
            if (next) {
                next(err);
                return;
            } else if (err && err.isAxiosError === true) {
                const axiosError: AxiosError = err;
                const code: number = axiosError.response?.status || 500;
                res.status(code).json({
                    error: true,
                    statusCode: code,
                });
                return;
            } else {
                const code: number = err?.statusCode || 500;
                res.status(code).json({
                    error: true,
                    statusCode: code,
                });
                return;
            }
        });
};
