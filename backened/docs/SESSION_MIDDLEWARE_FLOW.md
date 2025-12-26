# Session Middleware Flow Diagram

## Complete Session Middleware Logic

---

## 🔄 Main Flow Diagram

```mermaid
flowchart TD
    Start([Incoming HTTP Request]) --> ParseCookies[Parse Cookies from Request]

    ParseCookies --> CheckSession{Session Cookie<br/>Exists?}

    %% Path 1: Existing Session Cookie
    CheckSession -->|Yes| ExtractSessionId[Extract session_id from Cookie]
    ExtractSessionId --> RedisLookup[🔍 Redis Lookup<br/>GET session:session_id]

    RedisLookup --> RedisFound{Found in<br/>Redis?}

    RedisFound -->|Yes - Cache Hit| ValidSession[✅ Valid Active Session]
    ValidSession --> ExtendTTL[Extend Redis TTL<br/>30 more minutes]
    ExtendTTL --> UpdateLastSeen[Update lastSeenAt<br/>in MongoDB async]
    UpdateLastSeen --> AttachSession

    RedisFound -->|No - Cache Miss| MongoLookup[🔍 MongoDB Lookup<br/>Find by sessionId]

    MongoLookup --> MongoFound{Found in<br/>MongoDB?}

    MongoFound -->|Yes - Expired Session| RecacheSession[Re-cache in Redis<br/>TTL: 30 min]
    RecacheSession --> AttachSession

    MongoFound -->|No - Invalid Session| CreateNew

    %% Path 2: No Session Cookie
    CheckSession -->|No| CheckVisitor{visitor_id Cookie<br/>Exists?}

    CheckVisitor -->|Yes| UseVisitorId[Use Existing visitor_id]
    CheckVisitor -->|No| GenerateVisitorId[Generate New visitor_id<br/>UUID v4]

    UseVisitorId --> CreateNew
    GenerateVisitorId --> CreateNew

    %% Create New Session
    CreateNew[📝 Create New Session]
    CreateNew --> GenerateSessionId[Generate session_id<br/>UUID v4]
    GenerateSessionId --> ParseMetadata[Parse Request Metadata]

    ParseMetadata --> MetadataList[Collect:<br/>• IP Address<br/>• User Agent<br/>• Landing Page<br/>• Referrer<br/>• UTM Params]

    MetadataList --> ParseUA[Parse User Agent]
    ParseUA --> DeviceInfo[Extract:<br/>• Device type<br/>• Browser<br/>• OS]

    DeviceInfo --> CreateMongo[💾 Create in MongoDB]
    CreateMongo --> CreateRedis[💾 Cache in Redis<br/>TTL: 30 min]
    CreateRedis --> SetCookies[Set Response Cookies]

    SetCookies --> SessionCookie["🍪 Set-Cookie: session<br/>HttpOnly, Secure, SameSite=Lax<br/>Max-Age: 1800 (30 min)"]
    SessionCookie --> VisitorCookie["🍪 Set-Cookie: visitor_id<br/>Max-Age: 31536000 (1 year)"]

    VisitorCookie --> AttachSession

    %% Attach Session to Request
    AttachSession[Attach Session to req.session]
    AttachSession --> TrackPageView[Track page_view Event<br/>Async, Non-blocking]

    TrackPageView --> IncrementViews[Increment pageViews Counter]
    IncrementViews --> NextMiddleware[Call next Middleware]

    NextMiddleware --> End([Continue to Controller])

    %% Error Handling
    RedisLookup -.->|Error| ErrorHandler[Log Error]
    MongoLookup -.->|Error| ErrorHandler
    CreateMongo -.->|Error| ErrorHandler

    ErrorHandler --> ContinueWithoutSession[Continue Without Session<br/>Don't Block Request]
    ContinueWithoutSession --> NextMiddleware

    %% Styling
    classDef redisStyle fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px,color:#fff
    classDef mongoStyle fill:#4ecdc4,stroke:#0a9396,stroke-width:2px,color:#fff
    classDef cookieStyle fill:#ffd93d,stroke:#f5a623,stroke-width:2px,color:#333
    classDef successStyle fill:#51cf66,stroke:#2f9e44,stroke-width:2px,color:#fff
    classDef decisionStyle fill:#a78bfa,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef errorStyle fill:#ff8787,stroke:#e03131,stroke-width:2px,color:#fff

    class RedisLookup,ExtendTTL,CreateRedis redisStyle
    class MongoLookup,CreateMongo,UpdateLastSeen mongoStyle
    class SessionCookie,VisitorCookie,SetCookies cookieStyle
    class ValidSession,AttachSession,NextMiddleware successStyle
    class CheckSession,RedisFound,MongoFound,CheckVisitor decisionStyle
    class ErrorHandler,ContinueWithoutSession errorStyle
```

---

## 🔀 Session State Transitions

```mermaid
stateDiagram-v2
    [*] --> NoSession: First Visit

    NoSession --> AnonymousSession: Create Session

    AnonymousSession --> ActiveAnonymous: User Browsing
    ActiveAnonymous --> ActiveAnonymous: Page Views

    ActiveAnonymous --> ExpiredAnonymous: 30 min Inactive
    ExpiredAnonymous --> AnonymousSession: Return Visit<br/>(Reactivate)

    ActiveAnonymous --> CustomerSession: Login

    CustomerSession --> ActiveCustomer: Authenticated Browsing
    ActiveCustomer --> ActiveCustomer: Page Views

    ActiveCustomer --> ExpiredCustomer: 30 min Inactive
    ExpiredCustomer --> CustomerSession: Return Visit<br/>(Reactivate)

    ActiveCustomer --> ConvertedSession: Create Order

    ConvertedSession --> [*]: Session Complete

    note right of AnonymousSession
        Redis: Active (30 min TTL)
        MongoDB: Persistent
        Type: ANONYMOUS
    end note

    note right of CustomerSession
        Redis: Active (30 min TTL)
        MongoDB: Persistent
        Type: CUSTOMER
        customerId: populated
    end note

    note right of ConvertedSession
        Redis: Active
        MongoDB: Persistent
        converted: true
        orderId: populated
    end note

    note right of ExpiredAnonymous
        Redis: Expired/Deleted
        MongoDB: Preserved
    end note
```

---

## 🗂️ Data Storage Layers

```mermaid
flowchart LR
    subgraph Client["🌐 Client (Browser)"]
        C1[🍪 Cookie: session<br/>Short-lived: 30 min]
        C2[🍪 Cookie: visitor_id<br/>Long-lived: 1 year]
    end

    subgraph Middleware["⚙️ Express Middleware"]
        M1[Parse Cookies]
        M2[Validate Session]
        M3[Attach to req.session]
    end

    subgraph Redis["⚡ Redis Cache<br/>(Hot Data)"]
        R1[session:abc123<br/>TTL: 30 min]
        R2[Active Sessions Only]
        R3[Fast Lookup: ~5ms]
    end

    subgraph MongoDB["💾 MongoDB<br/>(Persistent Storage)"]
        Mongo1[(sessions collection)]
        Mongo2[(session_events collection)]
        Mongo3[(daily_metrics collection)]
    end

    Client --> Middleware
    Middleware --> Redis
    Middleware --> MongoDB
    Redis -.->|Cache Miss| MongoDB
    MongoDB -.->|Recache| Redis

    style Client fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style Middleware fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style Redis fill:#ffebee,stroke:#c62828,stroke-width:2px
    style MongoDB fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
```

---

## 🔄 Request Lifecycle with Session

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant Redis
    participant MongoDB
    participant Controller

    Note over Client: First Visit
    Client->>+Middleware: GET /api/storefront/products<br/>No cookies

    Middleware->>Middleware: No session cookie found
    Middleware->>Middleware: Generate visitor_id & session_id

    Middleware->>+MongoDB: Create session document
    MongoDB-->>-Middleware: Session created

    Middleware->>+Redis: Cache session (TTL: 30min)
    Redis-->>-Middleware: Cached

    Middleware->>Client: Set-Cookie: session=abc123
    Middleware->>Client: Set-Cookie: visitor_id=xyz789

    Middleware->>Middleware: Attach to req.session
    Middleware->>+Controller: Forward request
    Controller-->>-Middleware: Response
    Middleware-->>-Client: Products list

    Note over Client,MongoDB: ===== Subsequent Request =====

    Client->>+Middleware: GET /api/storefront/products/123<br/>Cookie: session=abc123

    Middleware->>Middleware: Parse cookies
    Middleware->>+Redis: GET session:abc123
    Redis-->>-Middleware: Session data (cache hit)

    Middleware->>Redis: EXPIRE session:abc123 1800<br/>(extend TTL)

    Middleware->>MongoDB: Update lastSeenAt (async)

    Middleware->>Middleware: Attach to req.session
    Middleware->>Middleware: Track page_view event (async)

    Middleware->>+Controller: Forward request
    Controller-->>-Middleware: Response
    Middleware-->>-Client: Product details

    Note over Client,MongoDB: ===== Cache Miss Scenario =====

    Client->>+Middleware: GET /api/storefront/cart<br/>Cookie: session=abc123

    Middleware->>+Redis: GET session:abc123
    Redis-->>-Middleware: null (expired/not found)

    Middleware->>+MongoDB: Find session by sessionId
    MongoDB-->>-Middleware: Session found (old but valid)

    Middleware->>+Redis: Re-cache session (TTL: 30min)
    Redis-->>-Middleware: Cached

    Middleware->>Middleware: Attach to req.session
    Middleware->>+Controller: Forward request
    Controller-->>-Middleware: Response
    Middleware-->>-Client: Cart data
```

---

## 🎯 Event Tracking Flow

```mermaid
flowchart TD
    Request[HTTP Request Arrives] --> Middleware[Session Middleware]

    Middleware --> SessionReady[Session Attached to req.session]

    SessionReady --> AutoTrack[Auto-track page_view]

    AutoTrack --> AsyncEvent[Async Event Creation<br/>Non-blocking]

    AsyncEvent --> EventQueue[Event Queue<br/>Background Job]

    EventQueue --> CreateEvent[Create SessionEvent in MongoDB]

    CreateEvent --> UpdateMetrics[Update Session Metrics]

    UpdateMetrics --> IncrementPageViews[Increment pageViews counter]

    IncrementPageViews --> UpdateRedis[Update Redis cache]

    UpdateRedis --> UpdateMongo[Update MongoDB async]

    subgraph "Custom Events"
        Controller[Controller Action] --> TrackCustom[Track Custom Event<br/>e.g., add_to_cart]
        TrackCustom --> EventQueue
    end

    style AsyncEvent fill:#ffd93d,stroke:#f5a623,stroke-width:2px
    style EventQueue fill:#4ecdc4,stroke:#0a9396,stroke-width:2px
    style UpdateRedis fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px
```

---

## 🔐 Cookie Security Flow

```mermaid
flowchart LR
    subgraph Request["📨 Request Headers"]
        RH[Cookie: session=abc123]
    end

    subgraph Middleware["🔒 Cookie Parser"]
        CP[Parse Signed Cookie]
        CP --> Verify{Signature<br/>Valid?}
    end

    subgraph Validation["✅ Validation"]
        Verify -->|Yes| Extract[Extract session_id]
        Verify -->|No| Reject[Reject Invalid Cookie]

        Extract --> CheckExp{Cookie<br/>Expired?}
        CheckExp -->|No| Valid[✅ Valid Session ID]
        CheckExp -->|Yes| Reject
    end

    subgraph Response["📤 Response Headers"]
        SetCookie["Set-Cookie: session=new123<br/>HttpOnly; Secure; SameSite=Lax"]
    end

    Request --> Middleware
    Middleware --> Validation
    Valid --> Proceed[Continue Processing]
    Reject --> CreateNew[Create New Session]
    CreateNew --> SetCookie

    style Verify fill:#a78bfa,stroke:#7c3aed,stroke-width:2px
    style Valid fill:#51cf66,stroke:#2f9e44,stroke-width:2px
    style Reject fill:#ff8787,stroke:#e03131,stroke-width:2px
    style SetCookie fill:#ffd93d,stroke:#f5a623,stroke-width:2px
```

---

## 📊 Session Analytics Pipeline

```mermaid
flowchart TD
    Start[Session Activity] --> Events[Session Events Logged]

    Events --> RealTime[Real-time Metrics<br/>Every Minute]
    Events --> Daily[Daily Aggregation<br/>Midnight Cron]

    RealTime --> ActiveUsers[Count Active Users<br/>Last 30 minutes]
    ActiveUsers --> RealtimeDB[(RealtimeMetrics)]

    Daily --> QuerySessions[Query All Sessions<br/>for Yesterday]
    QuerySessions --> Calculate[Calculate Metrics]

    Calculate --> Visitors[Visitor Metrics<br/>• Total visits<br/>• Unique visits<br/>• New vs returning]
    Calculate --> Engagement[Engagement Metrics<br/>• Avg session duration<br/>• Page views<br/>• Bounce rate]
    Calculate --> Conversion[Conversion Metrics<br/>• Conversion rate<br/>• Cart rate<br/>• Purchase rate]

    Visitors --> Aggregate
    Engagement --> Aggregate
    Conversion --> Aggregate

    Aggregate[Aggregate All Metrics] --> DailyDB[(DailyMetrics)]

    DailyDB --> Dashboard[Admin Dashboard]
    RealtimeDB --> Dashboard

    style RealTime fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px,color:#fff
    style Daily fill:#4ecdc4,stroke:#0a9396,stroke-width:2px,color:#fff
    style Dashboard fill:#51cf66,stroke:#2f9e44,stroke-width:2px,color:#fff
```

---

## 🚦 Error Handling Flow

```mermaid
flowchart TD
    Middleware[Session Middleware] --> TryBlock[Try Block]

    TryBlock --> ParseCookies[Parse Cookies]
    ParseCookies --> RedisOp[Redis Operation]
    RedisOp --> MongoOp[MongoDB Operation]

    ParseCookies -.->|Error| CatchBlock[Catch Block]
    RedisOp -.->|Error| CatchBlock
    MongoOp -.->|Error| CatchBlock

    CatchBlock --> LogError[📝 Log Error Details]
    LogError --> CheckCritical{Critical<br/>Error?}

    CheckCritical -->|Yes| ErrorResponse[Return 500 Error<br/>Don't continue]
    CheckCritical -->|No| ContinueAnyway[Continue Without Session<br/>Call next]

    MongoOp --> Success[Successful Session Setup]
    Success --> AttachSession[Attach to req.session]
    AttachSession --> NextMiddleware[Call next]

    ContinueAnyway --> NextMiddleware

    NextMiddleware --> Controller[Controller Handles Request]

    style CatchBlock fill:#ff8787,stroke:#e03131,stroke-width:2px,color:#fff
    style LogError fill:#ffd93d,stroke:#f5a623,stroke-width:2px
    style Success fill:#51cf66,stroke:#2f9e44,stroke-width:2px,color:#fff
    style ErrorResponse fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px,color:#fff
```

---

## 🔄 Session Conversion (Login) Flow

```mermaid
flowchart TD
    Start[User Visits Site] --> CreateAnon[Anonymous Session Created<br/>Type: ANONYMOUS<br/>customerId: null]

    CreateAnon --> Browse[User Browses Products<br/>Track page_view events]

    Browse --> AddCart[Add Items to Cart<br/>Track add_to_cart events]

    AddCart --> Login[User Clicks Login]

    Login --> AuthRequest[POST /api/storefront/auth/login<br/>Cookie: session=abc123]

    AuthRequest --> ValidateCreds{Valid<br/>Credentials?}

    ValidateCreds -->|No| ErrorResponse[Return 401 Error]
    ValidateCreds -->|Yes| GetSession[Get Current Session from req.session]

    GetSession --> ConvertSession[Convert Session Type]

    ConvertSession --> UpdateFields[Update Session:<br/>• type: CUSTOMER<br/>• customerId: user_id<br/>• lastSeenAt: now]

    UpdateFields --> UpdateRedis[💾 Update Redis Cache]
    UpdateRedis --> UpdateMongo[💾 Update MongoDB]

    UpdateMongo --> TrackEvent[Track 'customer_login' Event]

    TrackEvent --> GenerateToken[Generate JWT Token]

    GenerateToken --> LoginSuccess[✅ Login Successful<br/>Same session_id maintained<br/>Complete journey preserved]

    LoginSuccess --> ContinueBrowsing[User Continues as<br/>Authenticated Customer]

    style CreateAnon fill:#a78bfa,stroke:#7c3aed,stroke-width:2px,color:#fff
    style ConvertSession fill:#ffd93d,stroke:#f5a623,stroke-width:2px
    style LoginSuccess fill:#51cf66,stroke:#2f9e44,stroke-width:2px,color:#fff
    style ErrorResponse fill:#ff8787,stroke:#e03131,stroke-width:2px,color:#fff
```

---

## 💰 Order Conversion Flow

```mermaid
flowchart TD
    CustomerSession[Customer Session Active<br/>Type: CUSTOMER<br/>converted: false] --> AddItems[Add Items to Cart]

    AddItems --> Checkout[Proceed to Checkout<br/>Track checkout_started event]

    Checkout --> CreateOrder[POST /api/storefront/orders<br/>Cookie: session=abc123]

    CreateOrder --> OrderService[Order Service]

    OrderService --> CreateOrderDB[Create Order in MongoDB]

    CreateOrderDB --> GetSession[Get Session from req.session]

    GetSession --> MarkConverted[Mark Session as Converted]

    MarkConverted --> UpdateSession[Update Session:<br/>• converted: true<br/>• orderId: order_123<br/>• lastSeenAt: now]

    UpdateSession --> UpdateRedis[💾 Update Redis]
    UpdateRedis --> UpdateMongo[💾 Update MongoDB]

    UpdateMongo --> TrackEvent[Track 'order_completed' Event]

    TrackEvent --> UpdateCustomer[Update Customer Analytics:<br/>• totalOrders++<br/>• totalSpent += amount<br/>• lastOrderDate = now]

    UpdateCustomer --> UpdateProduct[Update Product Analytics:<br/>• totalSales++<br/>• totalRevenue += price]

    UpdateProduct --> Success[✅ Order Created Successfully<br/>Session conversion tracked]

    Success --> Analytics[Session Journey Complete:<br/>visit → browse → login → cart → order]

    style CustomerSession fill:#a78bfa,stroke:#7c3aed,stroke-width:2px,color:#fff
    style MarkConverted fill:#ffd93d,stroke:#f5a623,stroke-width:2px
    style Success fill:#51cf66,stroke:#2f9e44,stroke-width:2px,color:#fff
    style Analytics fill:#4ecdc4,stroke:#0a9396,stroke-width:2px,color:#fff
```

---

## 📱 Multi-Device Session Tracking

```mermaid
flowchart TD
    User[Same User] --> Device1[Desktop Browser<br/>visitor_id: xyz789]
    User --> Device2[Mobile Browser<br/>visitor_id: xyz789]
    User --> Device3[Tablet Browser<br/>visitor_id: xyz789]

    Device1 --> Session1[Session 1<br/>session_id: abc123<br/>device: desktop]
    Device2 --> Session2[Session 2<br/>session_id: def456<br/>device: mobile]
    Device3 --> Session3[Session 3<br/>session_id: ghi789<br/>device: tablet]

    Session1 --> Visitor[Same visitor_id Links Sessions]
    Session2 --> Visitor
    Session3 --> Visitor

    Visitor --> Analytics[Cross-Device Analytics<br/>Track user journey across devices]

    Analytics --> Insights[Insights:<br/>• Device preferences<br/>• Cross-device conversions<br/>• Session continuity]

    style User fill:#a78bfa,stroke:#7c3aed,stroke-width:2px,color:#fff
    style Visitor fill:#ffd93d,stroke:#f5a623,stroke-width:2px
    style Analytics fill:#4ecdc4,stroke:#0a9396,stroke-width:2px,color:#fff
    style Insights fill:#51cf66,stroke:#2f9e44,stroke-width:2px,color:#fff
```

---

## 🎨 Legend

| Color     | Meaning            |
| --------- | ------------------ |
| 🔴 Red    | Redis operations   |
| 🔵 Cyan   | MongoDB operations |
| 🟡 Yellow | Cookie operations  |
| 🟢 Green  | Success states     |
| 🟣 Purple | Decision points    |
| 🔶 Orange | Error handling     |

---

## 📋 Key Takeaways

1. **Fast lookup**: Redis checked first (5ms), MongoDB fallback (50ms)
2. **Graceful degradation**: Errors don't block requests
3. **Journey preservation**: Same session_id from anonymous → customer → converted
4. **Async operations**: Events and metrics don't slow down responses
5. **Security first**: HttpOnly, Secure, SameSite cookies
6. **Cross-device tracking**: visitor_id links sessions across devices
7. **Complete attribution**: Track entire user journey for analytics

---

**Copy any of these Mermaid diagrams into your preferred Mermaid viewer or directly into GitHub/GitLab markdown files!**
