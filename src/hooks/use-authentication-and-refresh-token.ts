/**
 * @author WMXPY
 * @namespace Hooks
 * @description Use Authentication and Refresh Token
 */

import { BarkAuthenticationClient } from "@barksh/client-authentication-browser";
import { BarkAuthenticationToken, BarkRefreshToken } from "@barksh/token-browser";
import * as React from "react";

export type UseAuthenticationAndRefreshTokenResult = {

    readonly loading: true;
} | {

    readonly loading: false;
    readonly authenticationToken: BarkAuthenticationToken;
    readonly refreshToken: BarkRefreshToken;
};

export const useAuthenticationAndRefreshToken = (
    barkClient: BarkAuthenticationClient,
    onFailed?: () => void,
): UseAuthenticationAndRefreshTokenResult => {

    const isFailed = React.useRef<boolean>(false);

    const [authenticationToken, setAuthenticationToken] = React.useState<BarkAuthenticationToken | null>(null);
    const [refreshToken, setRefreshToken] = React.useState<BarkRefreshToken | null>(null);

    const getAuthenticationTokenMethod = async () => {

        const tempAuthenticationToken = await barkClient.getAuthenticationToken();

        if (isFailed.current) {
            return;
        }

        if (!tempAuthenticationToken) {

            isFailed.current = true;

            if (typeof onFailed === 'function') {
                onFailed();
            }
            return;
        }
        setAuthenticationToken(tempAuthenticationToken);
    };

    const getRefreshTokenMethod = async () => {

        const tempRefreshToken = await barkClient.getRefreshToken();

        if (isFailed.current) {
            return;
        }

        if (!tempRefreshToken) {

            isFailed.current = true;

            if (typeof onFailed === 'function') {
                onFailed();
            }
            return;
        }
        setRefreshToken(tempRefreshToken);
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
