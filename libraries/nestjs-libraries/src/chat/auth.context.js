import { getAuth } from "./async.storage";
export const checkAuth = (inputData, context) => {
    var _a, _b;
    const auth = getAuth();
    const authInfo = ((_b = (_a = context === null || context === void 0 ? void 0 : context.mcp) === null || _a === void 0 ? void 0 : _a.extra) === null || _b === void 0 ? void 0 : _b.authInfo) || auth;
    if (authInfo && (context === null || context === void 0 ? void 0 : context.requestContext)) {
        context.requestContext.set('organization', JSON.stringify(authInfo));
        context.requestContext.set('ui', 'false');
    }
};
//# sourceMappingURL=auth.context.js.map