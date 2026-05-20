# Architecture

## Overview

InsightBoard is a React Native application focused on realtime collaborative insight management.

The architecture prioritizes:

1. realtime correctness
2. responsive mobile UX
3. predictable GraphQL data flow
4. maintainable component separation

---

# Core Stack

UI Layer

- React Native
- Expo

Data Layer

- Apollo Client
- GraphQL

Backend Services

- Supabase
  - Auth
  - Realtime Postgres Changes
  - Presence

Validation

- Zod

---

# Data Flow

GraphQL is used for:

- queries
- create mutations
- update mutations
- filtered retrieval

Apollo Client manages:

- server communication
- loading/error states
- typed responses

---

# State Management Strategy

Two-layer state approach.

## Apollo State

Responsible for:

- backend synchronization
- query execution
- mutation lifecycle

## Local UI State

Responsible for:

- optimistic movement
- realtime merge handling
- modal synchronization
- temporary UI interaction state

This separation reduced unnecessary full refetches.

---

# Realtime Collaboration Design

## Postgres Changes

Supabase realtime subscriptions listen to:

```ts
insights table
```

Supported events:

- INSERT
- UPDATE

Behavior:

### Move Sync

When another user changes stage:

- board updates immediately
- toast displayed
- pipeline counts refresh

### Edit Sync

If detail modal is open:

- modal data updates live

### Cleanup

Subscriptions removed on component unmount.

---

# Presence Design

Supabase Presence channels manage online awareness.

Implemented behavior:

- join on foreground
- leave on background
- live online user list
- avatar stack rendering

Deduplication logic prevents repeated users.

---

# Form Architecture

Forms use:

- controlled inputs
- Zod validation
- realtime validation

Features:

- create/edit reuse
- unsaved changes protection
- dynamic error rendering

---

# Analytics Design

Analytics screen derives client-side calculations from GraphQL data.

Computed metrics:

- total insights
- stage distribution
- weekly trends

Chosen visualization:

Insights Over Time chart.

Reasoning:

Provides trend visibility while remaining lightweight for assignment scope.

---

# Tradeoffs

## Realtime Stability over Animation Complexity

Primary focus was placed on:

- realtime correctness
- synchronization consistency
- optimistic UX

Heavy animation polish was intentionally deprioritized during deadline constraints.

## Hybrid State Strategy

Local state was intentionally retained alongside Apollo to support smoother optimistic interactions and realtime reconciliation.

---