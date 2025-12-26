# 🎟️ Coupon API Mock Data

Use these payloads to test the `/api/admin/coupons` endpoints.

## 1. Create Fixed Discount ($20 Off)

**POST** `/api/admin/coupons`

```json
{
  "code": "SUMMER2025",
  "name": "Summer Sale Discount",
  "type": "FIXED",
  "value": 20,
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-06-30T23:59:59Z",
  "usageLimit": 500,
  "status": "ACTIVE"
}
```

## 2. Create Percentage Discount (15% Off)

**POST** `/api/admin/coupons`

```json
{
  "code": "WELCOME15",
  "name": "New Customer Welcome",
  "type": "PERCENTAGE",
  "value": 15,
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": null,
  "usageLimit": null,
  "status": "ACTIVE"
}
```

## 3. Create Free Shipping

**POST** `/api/admin/coupons`

```json
{
  "code": "SHIPFREE",
  "name": "Free Shipping on Orders > $50",
  "type": "FREE_SHIPPING",
  "value": 0,
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": null,
  "status": "ACTIVE",
  "appliesTo": {
    "condition": "min_order_value",
    "value": 50
  }
}
```

## 4. Create Expired Coupon (For Testing Filters)

**POST** `/api/admin/coupons`

```json
{
  "code": "OLD2023",
  "name": "Old Cyber Monday",
  "type": "FIXED",
  "value": 50,
  "startDate": "2023-11-01T00:00:00Z",
  "endDate": "2023-11-30T23:59:59Z",
  "status": "EXPIRED"
}
```

## 5. List All Coupons (Example Query)

**GET** `/api/admin/coupons?limit=10&page=1&status=ACTIVE&sortBy=startDate&sortOrder=desc`

## 6. Update Coupon

**PUT** `/api/admin/coupons/[ID]`

```json
{
  "name": "Summer Sale Extended!",
  "endDate": "2025-07-15T23:59:59Z",
  "usageLimit": 1000
}
```
