/**
 * OAuth Types for MCP Authentication
 *
 * Standalone types and helpers for OAuth-protected MCP servers.
 * Based on Mastra's implementation at commit 27c37ca.
 *
 * @see https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
 * @see https://www.rfc-editor.org/rfc/rfc9728.html
 */
function escapeHeaderValue(value) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
export function generateWWWAuthenticateHeader(options = {}) {
    const params = [];
    if (options.resourceMetadataUrl) {
        params.push(`resource_metadata="${escapeHeaderValue(options.resourceMetadataUrl)}"`);
    }
    if (options.additionalParams) {
        for (const [key, value] of Object.entries(options.additionalParams)) {
            params.push(`${key}="${escapeHeaderValue(value)}"`);
        }
    }
    if (params.length === 0) {
        return 'Bearer';
    }
    return `Bearer ${params.join(', ')}`;
}
export function generateProtectedResourceMetadata(config) {
    var _a;
    return Object.assign(Object.assign({ resource: config.resource, authorization_servers: config.authorizationServers, scopes_supported: (_a = config.scopesSupported) !== null && _a !== void 0 ? _a : ['mcp:read', 'mcp:write'], bearer_methods_supported: ['header'] }, (config.resourceName && { resource_name: config.resourceName })), (config.resourceDocumentation && {
        resource_documentation: config.resourceDocumentation,
    }));
}
export function extractBearerToken(authHeader) {
    if (!authHeader)
        return undefined;
    const prefix = 'bearer ';
    if (authHeader.length <= prefix.length)
        return undefined;
    if (authHeader.slice(0, prefix.length).toLowerCase() !== prefix)
        return undefined;
    const token = authHeader.slice(prefix.length).trim();
    return token || undefined;
}
//# sourceMappingURL=oauth-types.js.map