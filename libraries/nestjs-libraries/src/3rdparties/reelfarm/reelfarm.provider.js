import { __awaiter, __decorate } from "tslib";
import { ThirdParty, ThirdPartyAbstract, } from "../thirdparty.interface";
const BASE_URL = 'https://reel.farm/api/v1';
let ReelFarmProvider = class ReelFarmProvider extends ThirdPartyAbstract {
    checkConnection(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${BASE_URL}/videos?limit=1`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            });
            if (!res.ok) {
                return false;
            }
            return {
                name: 'Reel.Farm',
                username: 'reelfarm',
                id: apiKey.slice(-8),
            };
        });
    }
    listMedia(apiKey, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = (data === null || data === void 0 ? void 0 : data.page) || 1;
            const limit = 20;
            const offset = (page - 1) * limit;
            const allVideos = [];
            for (const videoType of ['ugc', 'greenscreen']) {
                const res = yield fetch(`${BASE_URL}/videos?video_type=${videoType}&status=completed&limit=${limit}&offset=${offset}`, {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                });
                if (res.ok) {
                    const body = yield res.json();
                    const videos = body.videos || body.data || [];
                    console.log(body);
                    allVideos.push(...videos.map((v) => (Object.assign(Object.assign({}, v), { _video_type: videoType }))));
                }
            }
            const total = allVideos.length;
            console.log(allVideos);
            return {
                results: allVideos.slice(0, limit).map((v) => ({
                    id: String(v.id || v.video_id),
                    url: v.video_url || v.url || v.download_url || '',
                    thumbnail: v.thumbnail_url || v.thumbnail || v.preview_url || '',
                    name: `${v._video_type}`,
                    type: 'video',
                })),
                pages: Math.max(1, Math.ceil(total / limit)),
            };
        });
    }
    importMedia(apiKey, items) {
        return __awaiter(this, void 0, void 0, function* () {
            return items
                .filter((item) => item.url)
                .map((item) => ({
                url: item.url.split('#')[0].split('?')[0],
                name: item.name || 'reelfarm-video',
            }));
        });
    }
    sendData() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('ReelFarm media-library provider does not support sendData');
        });
    }
};
ReelFarmProvider = __decorate([
    ThirdParty({
        identifier: 'reelfarm',
        title: 'Reel.Farm',
        description: 'Import UGC and greenscreen videos from your Reel.Farm account.',
        position: 'media-library',
        fields: [],
    })
], ReelFarmProvider);
export { ReelFarmProvider };
//# sourceMappingURL=reelfarm.provider.js.map