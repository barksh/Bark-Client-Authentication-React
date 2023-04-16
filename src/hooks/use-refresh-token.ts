/**
 * @author WMXPY
 * @namespace Hooks
 * @description Use Refresh Token
 */

import { BarkAuthenticationClient } from "@barksh/client-authentication-browser";
import { BarkRefreshToken } from "@barksh/token-browser";
import * as React from "react";

export type UseRefreshTokenResult = {

    readonly loading: true;
} | {

    readonly loading: false;
    readonly token: BarkRefreshToken;
};

export const useRefreshToken = (
    barkClient: BarkAuthenticationClient,
    onFailed?: () => void,
): UseRefreshTokenResult => {

    const [refreshToken, setRefreshToken] = React.useState<BarkRefreshToken | null>(null);

    const getTokenMethod = async () => {

        const tempRefreshToken = await barkClient.getRefreshToken();

        if (!tempRefreshToken) {

            if (typeof onFailed === 'function') {
                onFailed();
            }
            return;
        }
        setRefreshToken(tempRefreshToken);
    };

    React.useEffect(() => {
        getTokenMethod();
    }, []);

    if (refreshToken === null) {
        return {
            loading: true,
        };
    }

    return {
        loading: false,
        token: refreshToken,
    };
};
