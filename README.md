# 🚩 LocalFlags

> **Feature flags, simplified. Local-first, database-backed, and fully under your control.**

## 🚀 Why LocalFlags?

Stop relying on expensive, third-party services for simple feature toggles. **LocalFlags** brings feature management directly into your existing database and Next.js application.

*   **Local First**: Flags are fetched directly from your database (via Prisma). No external API calls, no third-party dependencies.
*   **Full Control**: You own the data. No external API calls.
*   **Instant Setup**: One command to set up your schema and a full management dashboard.

## 🛠 Prerequisites

Before you begin, ensure your project meets the following requirements:

*   **Next.js 14+** (App Router recommended)
*   **Prisma** (configured with a database)
*   **Shadcn UI** (required for the generated dashboard)

## 📦 Installation

Install the package using npm:

```bash
npm i localflags
```

## ⚡️ Quick Setup

Initialize `localflags` in your project. This command will automatically update your Prisma schema and clone the management dashboard into your app.

```bash
npx localflags init
```

After initialization, run the following commands to update your database:

```bash
npx prisma generate
npx prisma migrate dev
```

> **Note:** The dashboard will be created at `/app/localflags` or `/src/app/localflags`. Ensure you have Shadcn UI components installed for it to render correctly.

## 📖 Usage

### 1. Initialize the Client

Create a single instance of the `LocalFlagsClient` using your Prisma client.

```typescript
import { PrismaClient } from "@prisma/client";
import { LocalFlagsClient } from "localflags";

const prisma = new PrismaClient();
export const flags = new LocalFlagsClient(prisma);
```

### 2. Check a Flag

Use the `isEnabled` method to check if a feature should be active for a user.

```typescript
// Inside a Server Component or API Route
import { flags } from "@/lib/flags"; // adjust path as needed

const showNewFeature = await flags.isEnabled({
  flagName: "new-checkout-flow",
  userIdentifier: user.id, // Unique ID for percentage rollouts
  userConditions: {
    email: user.email,
    role: user.role, // e.g. "admin"
  },
});

if (showNewFeature) {
  // Render new feature
}
```

### 3. Manage Flags

Visit the generated dashboard route (e.g., `http://localhost:3000/localflags`) to create, update, and delete feature flags. You can configure:

*   **Rollout Percentage**: Gradually release features (0-100%).
*   **User Targeting**: Enable for specific user IDs.
*   **Conditions**: Set rules based on user properties (JSON).

## 🤝 Contributing

We welcome contributions! Whether it's fixing bugs, improving documentation, or suggesting new features, your help is appreciated.

1.  Fork the repository.
2.  Create a feature branch.
3.  Commit your changes.
4.  Open a Pull Request.

Let's build the best local feature flag solution together!
