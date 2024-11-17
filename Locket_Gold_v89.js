const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);

// Thông báo cho người dùng
obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

// Thông tin đăng ký Gold
const locketSubscription = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-31T23:59:59Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2023-01-01T00:00:00Z",
  purchase_date: "2023-01-01T00:00:00Z",
  store: "app_store"
};

const locketEntitlement = {
  grace_period_expires_date: null,
  purchase_date: "2023-01-01T00:00:00Z",
  product_identifier: "com.locket.gold.badge",
  expires_date: "2099-12-31T23:59:59Z"
};

// Đảm bảo `entitlements` tồn tại
if (!obj.subscriber.entitlements) {
  obj.subscriber.entitlements = {};
}

// Đảm bảo `subscriptions` tồn tại
if (!obj.subscriber.subscriptions) {
  obj.subscriber.subscriptions = {};
}

// Tìm kiếm User-Agent trong mapping
const match = Object.keys(mapping).find(e => ua.includes(e));

// Cập nhật thông tin đăng ký và huy hiệu Gold
if (match) {
  let [entitlementKey, productIdentifier] = mapping[match];
  if (productIdentifier) {
    locketEntitlement.product_identifier = productIdentifier;
    obj.subscriber.subscriptions[productIdentifier] = locketSubscription;
  } else {
    obj.subscriber.subscriptions["com.locket02.premium.yearly"] = locketSubscription;
  }
  obj.subscriber.entitlements[entitlementKey] = locketEntitlement;
} else {
  obj.subscriber.subscriptions["com.locket02.premium.yearly"] = locketSubscription;
  obj.subscriber.entitlements["Gold"] = locketEntitlement;
}

// Trả về phản hồi đã chỉnh sửa
$done({ body: JSON.stringify(obj) });