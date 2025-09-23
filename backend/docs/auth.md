# Authentication Pattern Documentation

## Middleware: `requireAuth`

We use a reusable middleware to secure protected routes.

```ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuthHeader } from "./auth";

export function requireAuth(req: NextRequest) {
  const user = getUserFromAuthHeader(req as any);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return user; // { userId: string }
}
```

* Reads the `Authorization` header (`Bearer <accessToken>`).
* Returns `401` if the token is missing or invalid.
* Returns `{ userId }` if valid.

---

## Using `requireAuth` in API Routes

Example: `logoutAll` route

```ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/requireAuth";
import { logoutAllSessions } from "@/services/authService";

export async function POST(req: NextRequest) {
  // Authentication check
  const authResult = requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { userId } = authResult;

  try {
    await logoutAllSessions(userId);
    return NextResponse.json({ message: "All sessions logged out successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
```

**Key Points:**

* Always call `requireAuth(req)` at the beginning of the route.
* Check if the return value is a `NextResponse` → immediately return if unauthorized.
* Use `userId` from the returned object for business logic.
* Handle other errors with `500 Internal Server Error`.

---

## Recommended Usage

This pattern should be applied to **all protected routes** like:

* Logout
* Logout All Sessions
* User Profile Updates
* Any other API endpoint requiring authentication

This ensures **consistent and secure access control** across the application.

---

## Best Practices

* Always include the `Authorization` header in the format:

  ```
  Authorization: Bearer <accessToken>
  ```
* Keep middleware reusable so any future route requiring authentication can use it without changes.
* Centralize error handling where possible to maintain consistent API responses.
* Never expose sensitive information in error messages (e.g., password, token details).
