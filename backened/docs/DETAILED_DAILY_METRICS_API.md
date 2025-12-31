# Detailed Daily Metrics API Documentation

## Overview

This endpoint provides formatted daily metrics organized by day of week for the Customer Overview and Report cards in the admin dashboard.

---

## Endpoint Details

### Get Detailed Daily Metrics

**Endpoint:** `GET /api/admin/analytics/detailed-daily-metrics`

**Description:** Returns daily metrics for both this week and last week, formatted by day of week (Sun-Sat) for the Customer Overview and Report cards.

**Authentication:** Required (Admin token)

**Request:**

```http
GET /api/admin/analytics/detailed-daily-metrics HTTP/1.1
Host: localhost:5000
Authorization: Bearer <admin_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Detailed daily metrics fetched successfully",
  "data": {
    "customerOverview": {
      "thisWeek": [
        {
          "day": "Sun",
          "activeCustomers": 12,
          "repeatCustomers": 3,
          "shopVisitor": 45,
          "conversionRate": 26.67
        },
        {
          "day": "Mon",
          "activeCustomers": 15,
          "repeatCustomers": 5,
          "shopVisitor": 62,
          "conversionRate": 24.19
        }
        // ... (Tue, Wed, Thu, Fri, Sat)
      ],
      "lastWeek": [
        {
          "day": "Sun",
          "activeCustomers": 10,
          "repeatCustomers": 2,
          "shopVisitor": 38,
          "conversionRate": 26.32
        }
        // ... (Mon-Sat)
      ]
    },
    "report": {
      "thisWeek": [
        {
          "day": "Sun",
          "customers": 12,
          "totalProducts": 25,
          "stockProducts": 22,
          "outOfStock": 3,
          "revenue": 3492.4
        },
        {
          "day": "Mon",
          "customers": 15,
          "totalProducts": 25,
          "stockProducts": 22,
          "outOfStock": 3,
          "revenue": 4125.8
        }
        // ... (Tue-Sat)
      ],
      "lastWeek": [
        {
          "day": "Sun",
          "customers": 10,
          "totalProducts": 25,
          "stockProducts": 23,
          "outOfStock": 2,
          "revenue": 2850.5
        }
        // ... (Mon-Sat)
      ]
    }
  }
}
```

---

## Data Structure

### DailyMetricByDay

Each day contains the following metrics:

| Field             | Type   | Description                                     |
| ----------------- | ------ | ----------------------------------------------- |
| `day`             | string | Day of week (Sun, Mon, Tue, Wed, Thu, Fri, Sat) |
| `activeCustomers` | number | Total customers (new + returning) for that day  |
| `repeatCustomers` | number | Number of returning customers                   |
| `shopVisitor`     | number | Total shop visitors (sessions)                  |
| `conversionRate`  | number | Conversion rate percentage                      |
| `customers`       | number | Same as activeCustomers (for report card)       |
| `totalProducts`   | number | Total products in catalog                       |
| `stockProducts`   | number | Number of in-stock products                     |
| `outOfStock`      | number | Number of out-of-stock products                 |
| `revenue`         | number | Total revenue for that day                      |

---

## Use Cases

### 1. Customer Overview Card

Use the `customerOverview` section to display:

- **Active Customers**: New + returning customers per day
- **Repeat Customers**: Returning customers per day
- **Shop Visitor**: Total visitors per day
- **Conversion Rate**: Purchase conversion percentage

**Frontend Integration:**

```typescript
import { useGetDetailedDailyMetricsQuery } from "@/api/analyticsApi";

const CustomerOverview = () => {
  const { data, isLoading } = useGetDetailedDailyMetricsQuery();

  const [activeTab, setActiveTab] = useState<"thisWeek" | "lastWeek">(
    "thisWeek"
  );
  const metrics = data?.customerOverview[activeTab] || [];

  // Display chart with metrics
  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tab value="thisWeek">This week</Tab>
        <Tab value="lastWeek">Last week</Tab>
      </Tabs>

      <LineChart data={metrics} />

      {/* Display summary stats */}
      <div>
        <Stat label="Active Customers" value={/* sum or latest */} />
        <Stat label="Repeat Customers" value={/* sum or latest */} />
        <Stat label="Shop Visitor" value={/* sum or latest */} />
        <Stat label="Conversion Rate" value={/* average */} />
      </div>
    </Card>
  );
};
```

### 2. Report Card

Use the `report` section to display:

- **Customers**: Total customers per day
- **Total Products**: Products in catalog
- **Stock Products**: In-stock products
- **Out of Stock**: Out-of-stock products
- **Revenue**: Daily revenue

**Frontend Integration:**

```typescript
const Report = () => {
  const { data, isLoading } = useGetDetailedDailyMetricsQuery();

  const [activeTab, setActiveTab] = useState<"thisWeek" | "lastWeek">(
    "thisWeek"
  );
  const metrics = data?.report[activeTab] || [];

  return (
    <Card>
      <h2>Report for {activeTab === "thisWeek" ? "this" : "last"} week</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tab value="thisWeek">This week</Tab>
        <Tab value="lastWeek">Last week</Tab>
      </Tabs>

      <BarChart data={metrics} />

      {/* Display summary stats */}
      <div>
        <Stat label="Customers" value={/* sum */} />
        <Stat label="Total Products" value={/* latest */} />
        <Stat label="Stock Products" value={/* latest */} />
        <Stat label="Out of Stock" value={/* latest */} />
        <Stat label="Revenue" value={/* sum */} />
      </div>
    </Card>
  );
};
```

---

## Implementation Details

### Backend Structure

**Controller:** `/src/controllers/admin/analytics.controller.ts`

```typescript
export const getDetailedDailyMetrics = async (_req: Request, res: Response) => {
  const metrics = await analyticsService.getDetailedDailyMetrics();
  res.json(
    successResponse(metrics, "Detailed daily metrics fetched successfully")
  );
};
```

**Service:** `/src/services/analytics.service.ts`

```typescript
async getDetailedDailyMetrics(): Promise<DetailedDailyMetricsResponse> {
  const { thisWeek, previousWeek } = getTwoWeekRollingRange();

  const thisWeekMetrics = await analyticsRepository.getDailyMetricsInRange(thisWeek);
  const previousWeekMetrics = await analyticsRepository.getDailyMetricsInRange(previousWeek);

  // Formats metrics by day of week (Sun-Sat)
  const formatMetricsByDay = (metrics: any[]): DailyMetricByDay[] => {
    // ... formatting logic
  };

  return {
    customerOverview: {
      thisWeek: formatMetricsByDay(thisWeekMetrics),
      lastWeek: formatMetricsByDay(previousWeekMetrics),
    },
    report: {
      thisWeek: formatMetricsByDay(thisWeekMetrics),
      lastWeek: formatMetricsByDay(previousWeekMetrics),
    },
  };
}
```

**Repository:** `/src/repositories/analytics.repository.ts`

```typescript
async getDailyMetricsInRange({ from, to }: { from: Date; to: Date }) {
  const metrics = await prisma.dailyMetrics.findMany({
    where: {
      date: { gte: from, lte: to },
    },
    orderBy: { date: 'asc' },
  });

  return metrics;
}
```

---

## Data Flow

1. **Request** → Controller receives GET request
2. **Service** → Calculates current week and previous week date ranges
3. **Repository** → Fetches daily metrics from database for both weeks
4. **Formatting** → Organizes metrics by day of week (Sun-Sat)
5. **Response** → Returns formatted data for both cards

---

## Notes

- **Week Calculation**: Uses rolling week (last 7 days = this week, previous 7 days = last week)
- **Missing Days**: If no data exists for a day, it defaults to 0 values
- **Day Ordering**: Always returns 7 days (Sun-Sat) in order
- **Time Zone**: Uses server time zone for date calculations
- **Caching**: Consider implementing Redis caching for better performance

---

## Error Handling

**Common Errors:**

| Status Code | Message               | Cause                          |
| ----------- | --------------------- | ------------------------------ |
| 401         | Unauthorized          | Missing or invalid admin token |
| 500         | Internal Server Error | Database or server error       |

**Error Response:**

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

---

## Frontend TypeScript Types

```typescript
export interface DailyMetricByDay {
  day: string; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  activeCustomers: number;
  repeatCustomers: number;
  shopVisitor: number;
  conversionRate: number;
  customers: number;
  totalProducts: number;
  stockProducts: number;
  outOfStock: number;
  revenue: number;
}

export interface DetailedDailyMetricsResponse {
  customerOverview: {
    thisWeek: DailyMetricByDay[];
    lastWeek: DailyMetricByDay[];
  };
  report: {
    thisWeek: DailyMetricByDay[];
    lastWeek: DailyMetricByDay[];
  };
}
```

---

## Performance Considerations

1. **Database Indexes**: Ensure `date` field in `DailyMetrics` is indexed
2. **Query Optimization**: Fetches only 14 days of data maximum
3. **Caching**: Consider caching response for 5-10 minutes
4. **Response Size**: Approximately 2-3KB per response

---

## Testing

**cURL Example:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/analytics/detailed-daily-metrics
```

**Expected Behavior:**

- Returns 7 days for both this week and last week
- Each day has all required metrics
- Days are ordered Sun → Sat
- Missing data defaults to 0
