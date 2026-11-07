import { ConfigLatest, ConfigPre } from '../../config/singbox.js';

/**
 * 根据客户端 UA 生成 sing-box 配置。
 *
 * - 校验客户端类型，仅允许 sing-box / sing-box for Android(SFA) /
 *   sing-box for iOS(SFI) / sing-box for macOS(SFM) 等客户端。
 * - 根据参数决定是否注入 ECH DNS 配置。
 *
 * @param {Object} e 配置生成参数
 * @param {string} e.userAgent 客户端 User-Agent，用于判断版本和类型
 * @param {boolean} [e.checkUA=false] 是否启用客户端 UA 校验
 * @param {boolean} [e.ech=false] 是否启用 ECH DNS 注入
 *
 * @returns {Object} sing-box 配置对象
 *
 * @throws {Error} 当启用 UA 校验且客户端类型不受支持时抛出异常
 */
/**
 * 解析客户端 UA 中的 sing-box 版本号。
 *
 * 优先取客户端前缀（sing-box / SFA / SFI / SFM 等）之后的版本号，
 * 找不到前缀时退回到 UA 中任意 x.y.z 形式的版本号。
 *
 * @param {string} ua 客户端 User-Agent
 * @returns {{major: number, minor: number, patch: number} | null}
 */
function parseSingBoxVersion(ua) {
    if (!ua) return null;
    const m =
        ua.match(/(?:sing-box|singbox|sfa|sfi|sfm)[^0-9]*?(\d+)\.(\d+)\.(\d+)/i) ||
        ua.match(/(\d+)\.(\d+)\.(\d+)(?:-(?:alpha|beta|rc)\.\d+)?/i);
    if (!m) return null;
    return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

function Verbose(e) {
    const ua = e.userAgent;
    const version = parseSingBoxVersion(ua);
    // 1.14 起（含 1.14.0 预发布版及更高版本）使用 1.14 模板，低版本使用旧模板
    e.is114 = !!version && (version.major > 1 || (version.major === 1 && version.minor >= 14));

    if (e.checkUA && !/singbox|sing-box|sfa|sfm/i.test(ua)) {
        throw new Error('不支持的客户端');
    }
    if (e.is114) {
        return ConfigPre;
    }
    return ConfigLatest;
}

export { Verbose };
