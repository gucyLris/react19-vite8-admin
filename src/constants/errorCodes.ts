// HTTP 状态码
export const HttpStatusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
} as const

// 通用业务错误码（可根据后端定义扩展）
export const BizErrorCode = {
    // 用户认证相关
    TOKEN_EXPIRED: 10001,
    TOKEN_INVALID: 10002,
    USER_NOT_EXIST: 10003,
    PASSWORD_ERROR: 10004,
    ACCOUNT_LOCKED: 10005,

    // 权限相关
    NO_PERMISSION: 20001,
    ROLE_NOT_EXIST: 20002,

    // 参数/数据校验
    PARAM_MISSING: 30001,
    PARAM_INVALID: 30002,
    DATA_DUPLICATE: 30003,

    // 服务端错误
    SERVER_ERROR: 50001,
    DB_ERROR: 50002,
    THIRD_PARTY_ERROR: 50003
} as const

// 错误码对应的默认消息（可选）
export const ErrorCodeMessage: Record<number, string> = {
    [HttpStatusCode.UNAUTHORIZED]: '未授权，请重新登录',
    [HttpStatusCode.FORBIDDEN]: '拒绝访问',
    [HttpStatusCode.NOT_FOUND]: '请求资源不存在',
    [HttpStatusCode.INTERNAL_SERVER_ERROR]: '服务器错误',

    [BizErrorCode.TOKEN_EXPIRED]: '登录已过期，请重新登录',
    [BizErrorCode.TOKEN_INVALID]: '无效的令牌',
    [BizErrorCode.USER_NOT_EXIST]: '用户不存在',
    [BizErrorCode.PASSWORD_ERROR]: '密码错误',
    [BizErrorCode.ACCOUNT_LOCKED]: '账户已被锁定',
    [BizErrorCode.NO_PERMISSION]: '无操作权限',
    [BizErrorCode.PARAM_MISSING]: '缺少必要参数',
    [BizErrorCode.PARAM_INVALID]: '参数格式错误',
    [BizErrorCode.DATA_DUPLICATE]: '数据已存在',
    [BizErrorCode.SERVER_ERROR]: '服务繁忙，请稍后重试',
    [BizErrorCode.DB_ERROR]: '数据库异常',
    [BizErrorCode.THIRD_PARTY_ERROR]: '第三方服务异常'
}
