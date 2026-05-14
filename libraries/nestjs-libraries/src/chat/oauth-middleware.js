/**
 * OAuth Middleware for MCP Server
 *
 * Implements OAuth 2.0 Protected Resource support per RFC 9728 for MCP servers.
 * Based on Mastra's implementation at commit 27c37ca.
 *
 * @see https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
 * @see https://www.rfc-editor.org/rfc/rfc9728.html
 */
import { __awaiter } from "tslib";
import { generateProtectedResourceMetadata, generateWWWAuthenticateHeader, extractBearerToken, } from './oauth-types';
export function createOAuthMiddleware(options) {
    const { oauth, mcpPath = '/mcp', logger } = options;
    const protectedResourceMetadata = generateProtectedResourceMetadata(oauth);
    const wellKnownPath = '/.well-known/oauth-protected-resource';
    const resourceMetadataUrl = new URL(wellKnownPath, oauth.resource).toString();
    return function oauthMiddleware(req, res, url) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            (_a = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _a === void 0 ? void 0 : _a.call(logger, `OAuth middleware: ${req.method} ${url.pathname}`);
            // Handle Protected Resource Metadata endpoint (RFC 9728)
            if (url.pathname === wellKnownPath && req.method === 'GET') {
                (_b = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _b === void 0 ? void 0 : _b.call(logger, 'OAuth middleware: Serving Protected Resource Metadata');
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'max-age=3600',
                    'Access-Control-Allow-Origin': '*',
                });
                res.end(JSON.stringify(protectedResourceMetadata));
                return { proceed: false, handled: true };
            }
            // Handle CORS preflight for metadata endpoint
            if (url.pathname === wellKnownPath && req.method === 'OPTIONS') {
                res.writeHead(204, {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Max-Age': '86400',
                });
                res.end();
                return { proceed: false, handled: true };
            }
            // Only protect the MCP endpoint
            if (!url.pathname.startsWith(mcpPath)) {
                return { proceed: true, handled: false };
            }
            // Extract and validate bearer token
            const authHeader = req.headers['authorization'];
            const token = extractBearerToken(authHeader);
            if (!token) {
                (_c = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _c === void 0 ? void 0 : _c.call(logger, 'OAuth middleware: No bearer token provided');
                res.writeHead(401, {
                    'Content-Type': 'application/json',
                    'WWW-Authenticate': generateWWWAuthenticateHeader({ resourceMetadataUrl }),
                });
                res.end(JSON.stringify({
                    error: 'unauthorized',
                    error_description: 'Bearer token required',
                }));
                return { proceed: false, handled: true };
            }
            // Validate the token
            if (oauth.validateToken) {
                (_d = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _d === void 0 ? void 0 : _d.call(logger, 'OAuth middleware: Validating token');
                const validationResult = yield oauth.validateToken(token, oauth.resource);
                if (!validationResult.valid) {
                    (_e = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _e === void 0 ? void 0 : _e.call(logger, `OAuth middleware: Token validation failed: ${validationResult.error}`);
                    res.writeHead(401, {
                        'Content-Type': 'application/json',
                        'WWW-Authenticate': generateWWWAuthenticateHeader({
                            resourceMetadataUrl,
                            additionalParams: Object.assign({ error: validationResult.error || 'invalid_token' }, (validationResult.errorDescription && {
                                error_description: validationResult.errorDescription,
                            })),
                        }),
                    });
                    res.end(JSON.stringify({
                        error: validationResult.error || 'invalid_token',
                        error_description: validationResult.errorDescription || 'Token validation failed',
                    }));
                    return { proceed: false, handled: true, tokenValidation: validationResult };
                }
                (_f = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _f === void 0 ? void 0 : _f.call(logger, 'OAuth middleware: Token validated successfully');
                return { proceed: true, handled: false, tokenValidation: validationResult };
            }
            // If no validateToken function provided, accept the token
            (_g = logger === null || logger === void 0 ? void 0 : logger.debug) === null || _g === void 0 ? void 0 : _g.call(logger, 'OAuth middleware: No token validation configured, accepting token');
            return {
                proceed: true,
                handled: false,
                tokenValidation: { valid: true },
            };
        });
    };
}
export function createStaticTokenValidator(validTokens) {
    const tokenSet = new Set(validTokens);
    return (token) => __awaiter(this, void 0, void 0, function* () {
        if (tokenSet.has(token)) {
            return { valid: true, scopes: ['mcp:read', 'mcp:write'] };
        }
        return {
            valid: false,
            error: 'invalid_token',
            errorDescription: 'Token not recognized',
        };
    });
}
export function createIntrospectionValidator(introspectionEndpoint, clientCredentials) {
    return (token, resource) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
            if (clientCredentials) {
                if (clientCredentials.clientId.includes(':')) {
                    return {
                        valid: false,
                        error: 'invalid_request',
                        errorDescription: 'clientId cannot contain a colon character per RFC 7617',
                    };
                }
                const credentials = Buffer.from(`${clientCredentials.clientId}:${clientCredentials.clientSecret}`).toString('base64');
                headers['Authorization'] = `Basic ${credentials}`;
            }
            const response = yield fetch(introspectionEndpoint, {
                method: 'POST',
                headers,
                body: new URLSearchParams({
                    token,
                    token_type_hint: 'access_token',
                }),
            });
            if (!response.ok) {
                return {
                    valid: false,
                    error: 'server_error',
                    errorDescription: `Introspection failed: ${response.status}`,
                };
            }
            const data = (yield response.json());
            if (!data.active) {
                return {
                    valid: false,
                    error: 'invalid_token',
                    errorDescription: 'Token is not active',
                };
            }
            if (data.aud) {
                const audiences = Array.isArray(data.aud) ? data.aud : [data.aud];
                if (!audiences.includes(resource)) {
                    return {
                        valid: false,
                        error: 'invalid_token',
                        errorDescription: 'Token audience does not match this resource',
                    };
                }
            }
            return {
                valid: true,
                scopes: ((_a = data.scope) === null || _a === void 0 ? void 0 : _a.trim().split(' ').filter(s => s !== '')) || [],
                subject: data.sub,
                expiresAt: data.exp,
                claims: data,
            };
        }
        catch (error) {
            return {
                valid: false,
                error: 'server_error',
                errorDescription: error instanceof Error ? error.message : 'Introspection failed',
            };
        }
    });
}
//# sourceMappingURL=oauth-middleware.js.map