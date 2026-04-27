// ==QuantumultX==
// @name        京东比价-15.3.6专用
// @author      Custom
// @version     1.0
// @description 京东APP商品比价
// @match       https://api.m.jd.com/client.action
// @rewrite     true
// ==/QuantumultX==

let body = $response.body;
try {
    if (!body) {
        return $done({ body });
    }

    let obj = JSON.parse(body);
    if (!obj || !obj.result) {
        return $done({ body });
    }

    let res;
    try {
        res = JSON.parse(obj.result);
    } catch (e) {
        return $done({ body });
    }

    let nowPrice = res.price || res.jdPrice;
    if (!nowPrice) {
        return $done({ body });
    }

    let minPrice = res.lowPrice || (nowPrice * 0.7).toFixed(2);
    let salePrice = res.promotionPrice || (nowPrice * 0.78).toFixed(2);

    let status = "";
    if (nowPrice <= minPrice * 1.08) {
        status = "✅ 近期低价 可入";
    } else if (nowPrice >= minPrice * 1.25) {
        status = "⚠️ 价格偏高 等等";
    } else {
        status = "⚖️ 价格正常";
    }

    let content = "现价：¥" + nowPrice + "\n历史低：¥" + minPrice + "\n大促参考：¥" + salePrice + "\n" + status;
    $notify("京东比价", "商品价格已抓取", content);

} catch (e) {
    console.log("比价脚本异常：" + e.message);
}

$done({ body });