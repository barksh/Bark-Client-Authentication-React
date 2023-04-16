/**
 * @author WMXPY
 * @namespace Hooks
 * @description Use Authentication Token
 */

import { BarkAuthenticationClient } from "@barksh/client-authentication-browser";
import { BarkAuthenticationToken } from "@barksh/token-browser";
import * as React from "react";

export type UseAuthenticationTokenResult = {

    readonly loading: true;
} | {

    readonly loading: false;
    readonly token: BarkAuthenticationToken;
};

export const useAuthenticationToken = (
    barkClient: BarkAuthenticationClient,
    onFailed?: () => void,
): UseAuthenticationTokenResult => {

    const [authenticationToken, setAuthenticationToken] = React.useState<BarkAuthenticationToken | null>(null);

    const getTokenMethod = async () => {

        const authenticationToken = await barkClient.getAuthenticationToken();

        if (!authenticationToken) {

            if (typeof onFailed === 'function') {
                onFailed();
            }
            return;
        }
        setAuthenticationToken(authenticationToken);
    };

    React.useEffect(() => {
        getTokenMethod();
    }, []);

    if (authenticationToken === null) {
        return {
            loading: true,
        };
    }

    return {
        loading: false,
        token: authenticationToken,
    };
};
