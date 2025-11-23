# Client Specification

The Client layer provides ergonomic, high-level APIs for interacting with
external resources such as HTTP APIs, databases, message queues, etc.

## Overview

The Client layer abstracts low-level resource management and provides
easy-to-use interfaces for test developers. It achieves automatic cleanup
through explicit resource management (AsyncDisposable).

Clients are used within test steps to interact with external systems (HTTP APIs,
databases, etc.) while the framework handles connection lifecycle and cleanup.

## Core Responsibilities

- Abstract low-level resource management
- Provide type-safe, user-friendly interfaces for common test operations
- Implement explicit resource management (AsyncDisposable)
- Manage resource lifecycle (connection, cleanup)

## Interface

### HTTPClient

Client for REST API testing with automatic resource management.

```typescript
class HTTPClient implements AsyncDisposable {
  constructor(baseURL: string, options?: HTTPClientOptions);

  // Request methods
  get<T = unknown>(
    path: string,
    options?: RequestOptions,
  ): Promise<HTTPResult<T>>;
  post<T = unknown>(
    path: string,
    options?: RequestOptions,
  ): Promise<HTTPResult<T>>;
  put<T = unknown>(
    path: string,
    options?: RequestOptions,
  ): Promise<HTTPResult<T>>;
  patch<T = unknown>(
    path: string,
    options?: RequestOptions,
  ): Promise<HTTPResult<T>>;
  delete<T = unknown>(
    path: string,
    options?: RequestOptions,
  ): Promise<HTTPResult<T>>;
  head<T = unknown>(
    path: string,
    options?: RequestOptions,
  ): Promise<HTTPResult<T>>;

  // Configuration
  setHeaders(headers: Record<string, string>): this;
  setTimeout(timeout: number): this;
  setPoolSize(size: number): this;
  getOptions(): Readonly<HTTPClientOptions>;

  // Cookie management
  getCookies(): Record<string, string>;
  setCookie(name: string, value: string): this;
  clearCookies(): this;

  // Cleanup
  async [Symbol.asyncDispose](): Promise<void>;
}
```

### HTTPClientOptions

```typescript
interface HTTPClientOptions {
  /** Default headers applied to all requests */
  headers?: Record<string, string>;

  /** Default timeout in milliseconds (default: 30000) */
  timeout?: number;

  /** Connection pool size (default: 10) */
  poolSize?: number;

  /** Auto-follow redirects (default: true) */
  followRedirects?: boolean;

  /** Maximum redirect count (default: 5) */
  maxRedirects?: number;
}
```

### HTTPResult<T>

```typescript
interface HTTPResult<T = unknown> {
  /** HTTP status code */
  status: number;

  /** HTTP status text */
  statusText: string;

  /** Response headers */
  headers: Headers;

  /** Raw response body */
  body: Uint8Array;

  /** Response body as text */
  text: string;

  /** Response body as JSON (parsed) */
  json: T;

  /** Response body as Blob */
  blob: Blob;

  /** Request duration (milliseconds) */
  duration: number;
}
```

### Factory Functions

```typescript
export const client = {
  http: (baseURL: string, options?: HTTPClientOptions) =>
    new HTTPClient(baseURL, options),
  // Future: database, queue, etc.
};
```

## Built-in Clients

### HTTPClient

Client for REST API testing.

**Features**:

- Set default headers
- Cookie/session management
- Connection pooling
- Auto-follow redirects
- Type-safe responses

## Usage Examples

### Basic Usage

```typescript
await using api = client.http("https://api.example.com");

// Can be used without type specification (default: unknown)
const result = await api.get("/users");
console.log(result.json); // unknown type
console.log(result.duration); // Request duration
```

### Type-safe Response

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const result = await api.get<User>("/users/1");
result.json.name; // string type
result.json.email; // string type
```

### With Default Headers

```typescript
await using api = client.http("https://api.example.com", {
  headers: {
    "Authorization": "Bearer token",
    "User-Agent": "Probitas/1.0",
  },
});

const result = await api.get("/protected");
```

### Dynamic Configuration

```typescript
await using api = client.http("https://api.example.com");

// Add headers after creation
api.setHeaders({ "X-Session-ID": "abc123" });

// Chaining configuration
api
  .setHeaders({ "X-Request-ID": "req-456" })
  .setTimeout(5000);
```

### Cookie/Session Management

```typescript
await using api = client.http("https://api.example.com");

// Login (cookies are automatically saved)
await api.post("/login", {
  json: { username: "user", password: "pass" },
});

// Session cookies are automatically included
const result = await api.get("/profile");

// Check cookies
const cookies = api.getCookies();
console.log(cookies); // { session: "abc123", ... }
```

### Connection Pooling

```typescript
await using api = client.http("https://api.example.com", {
  poolSize: 20, // Keep up to 20 connections
});

// Parallel requests (automatically reuse connections from pool)
const results = await Promise.all([
  api.get("/users/1"),
  api.get("/users/2"),
  api.get("/users/3"),
  // ... up to 20 concurrent requests
]);
```

### Usage in Scenarios

```typescript
scenario("User API")
  .step("Create User", async () => {
    await using api = client.http("https://api.example.com");
    const result = await api.post("/users", {
      json: { name: "John" },
    });
    return result.json.id;
  })
  .step("Fetch User", async (ctx) => {
    await using api = client.http("https://api.example.com");
    const result = await api.get(`/users/${ctx.previous}`);
    expect(result.json.name).toBe("John");
  })
  .build();
```

### Authentication Flow

```typescript
scenario("Login Flow", {
  setup: async (ctx) => {
    const api = client.http("https://app.example.com");
    ctx.store.set("api", api);
  },
  teardown: async (ctx) => {
    const api = ctx.store.get("api") as HTTPClient;
    await api[Symbol.asyncDispose]();
  },
})
  .step("Login", async (ctx) => {
    const api = ctx.store.get("api") as HTTPClient;
    const result = await api.post("/login", {
      json: { username: "user", password: "pass" },
    });
    expect(result.status).toBe(200);
  })
  .step("Get Profile", async (ctx) => {
    const api = ctx.store.get("api") as HTTPClient;
    // Session cookies are automatically sent
    const result = await api.get("/profile");
    expect(result.json.username).toBe("user");
  })
  .build();
```

## Customization/Extension

### Custom Client

Custom Clients must implement `AsyncDisposable`. The following patterns are
commonly used:

- **Connection Management**: Manage resource connection and closure
- **Type Safety**: Type-safe API using generic type parameters
- **Configurable**: Support option configuration with builder pattern

**Basic Implementation Example**:

```typescript
class DatabaseClient implements AsyncDisposable {
  private connection: Connection;

  constructor(connectionString: string) {
    this.connection = connect(connectionString);
  }

  async query(sql: string): Promise<any[]> {
    return this.connection.query(sql);
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.connection.close();
  }
}
```

### Future Clients

#### DatabaseClient (Planned)

```typescript
await using db = client.database("postgres://localhost/testdb");

const users = await db.query("SELECT * FROM users");
await db.execute("INSERT INTO users (name) VALUES ($1)", ["John"]);
```

#### MessageQueueClient (Planned)

```typescript
await using queue = client.queue("amqp://localhost");

await queue.publish("events", { type: "user.created", id: 123 });
const message = await queue.consume("events");
```

#### WebSocketClient (Planned)

```typescript
await using ws = client.websocket("ws://localhost:8080");

ws.on("message", (data) => console.log(data));
await ws.send({ type: "ping" });
```

## Resource Management

### Explicit Resource Management

All clients use `Symbol.asyncDispose` for automatic cleanup:

```typescript
{
  await using api = client.http("https://api.example.com");
  await api.get("/data");
} // Automatically disposed here
```

### Manual Cleanup

If not using `using`, dispose manually:

```typescript
const api = client.http("https://api.example.com");
try {
  await api.get("/data");
} finally {
  await api[Symbol.asyncDispose]();
}
```

### Nested Resources

Resources can be nested:

```typescript
await using api1 = client.http("https://api1.example.com");
await using api2 = client.http("https://api2.example.com");

const data1 = await api1.get("/data");
const data2 = await api2.get("/data");

// Both automatically disposed in reverse order
```

## Best Practices

### 1. Use Type Parameters

Leverage TypeScript for response types:

```typescript
interface ApiResponse<T> {
  data: T;
  meta: { count: number };
}

const result = await api.get<ApiResponse<User[]>>("/users");
result.json.data[0].name; // Fully typed
```

### 2. Extract Base URL

Use environment variables for configuration:

```typescript
const API_BASE = Deno.env.get("API_URL") ?? "https://api.example.com";

await using api = client.http(API_BASE);
```

### 3. Reuse Client

Share client across steps via context:

```typescript
scenario("Test", {
  setup: (ctx) => {
    ctx.store.set("api", client.http("https://api.example.com"));
  },
})
  .step("Test 1", async (ctx) => {
    const api = ctx.store.get("api");
    await api.get("/endpoint1");
  });
```

### 4. Error Handling

Implement appropriate error handling:

```typescript
try {
  const result = await api.get("/data");
  if (result.status >= 400) {
    throw new Error(`HTTP ${result.status}: ${result.statusText}`);
  }
  return result.json;
} catch (error) {
  if (error instanceof TypeError) {
    // Network error
  } else {
    // Other errors
  }
  throw error;
}
```

### 5. Cookie Management

Manage cookies for session maintenance:

```typescript
// Cookies are automatically saved and sent
await api.post("/login", { json: credentials });
await api.get("/profile"); // Authenticated request

// Manual management if needed
api.setCookie("custom", "value");
api.clearCookies(); // Clear all
```

## Related Resources

- [Runner Specification](./runner.md) - Test execution
- [Architecture](./architecture.md) - Overall design
