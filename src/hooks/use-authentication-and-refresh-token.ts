/**
 * @author WMXPY
 * @namespace Hooks
 * @description Use Authentication and Refresh Token
 */

import { BarkAuthenticationClient } from "@barksh/client-authentication-browser";
import { BarkAuthenticationToken, BarkRefreshToken } from "@barksh/token-browser";
import * as React from "react";

export type UseRefreshTokenResult = {

    readonly loading: true;
} | {

    readonly loading: false;
    readonly authenticationToken: BarkAuthenticationToken;
    readonly refreshToken: BarkRefreshToken;
};

export const useAuthenticationAndRefreshToken = (
    barkClient: BarkAuthenticationClient,
    onFailed?: () => void,
): UseRefreshTokenResult => {

    const isFailed = React.useRef<boolean>(false);

    const [authenticationToken, setAuthenticationToken] = React.useState<BarkAuthenticationToken | null>(null);
    const [refreshToken, setRefreshToken] = React.useState<BarkRefreshToken | null>(null);

    const getAuthenticationTokenMethod = async () => {

        const authenticationToken = await barkClient.getAuthenticationToken();

        if (isFailed.current) {
            return;
        }

        if (!authenticationToken) {

            isFailed.current = true;

            if (typeof onFailed === 'function') {
                onFailed();
            }
            return;
        }
        setAuthenticationToken(authenticationToken);
    };

    const getRefreshTokenMethod = async () => {

        const refreshToken = await barkClient.getRefreshToken();

        if (isFailed.current) {
            return;
        }

        if (!refreshToken) {

            isFailed.current = true;

            if (typeof onFailed === 'function') {
                onFailed();
            }
            return;
        }
        setRefreshToken(refreshToken);
    };

    React.useEffect(() => {
        getAuthenticationTokenMethod();
        getRefreshTokenMethod();
    }, []);

    if (refreshToken === null || authenticationToken === null) {
        return {
            loading: true,
        };
    }

    return {
        loading: false,
        authenticationToken,
        refreshToken,
    };
};
