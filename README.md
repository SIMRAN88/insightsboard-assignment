# InsightBoard — Realtime Collaborative Insight Management App

Frontend engineering assignment implementation for Speer Health.

InsightBoard is a React Native mobile application designed for pharmaceutical teams to capture, organize, and collaborate on Healthcare Provider (HCP) insights.

The application provides a multi-stage insight pipeline, realtime collaboration between users, presence awareness, activity tracking, and analytics dashboards powered by GraphQL and Supabase realtime infrastructure.

Built with a strong focus on **realtime correctness**, **mobile UX**, and **responsive collaborative behavior**.

---

# Demo

### Loom Walkthrough

[ADD LOOM LINK]

Includes:

- Product walkthrough
- Realtime Alice/Bob collaboration demo
- Analytics dashboard walkthrough
- Architecture + code explanation

---

# Tech Stack

### Frontend

- React Native (Expo)
- TypeScript
- React Navigation

### Data Layer

- Apollo Client
- GraphQL (Supabase pg_graphql)

### Backend Services

- Supabase Auth
- Supabase Realtime (Postgres Changes)
- Supabase Presence

### Validation & UX

- Zod Validation
- React Error Boundary
- NetInfo Offline Detection

---

# Architecture Overview

The application uses a **hybrid state management strategy**.

### Apollo Client

Responsible for:

- GraphQL queries
- GraphQL mutations
- loading / error lifecycle
- backend synchronization

### Local UI State

Used for:

- optimistic interactions
- realtime reconciliation
- modal synchronization
- temporary UI responsiveness

This approach reduced unnecessary refetching while allowing smoother realtime collaboration behavior.

Realtime collaboration is powered using:

- **Supabase Postgres Changes** → live board synchronization
- **Supabase Presence** → online user awareness

---

# Feature Completion

## Module 1 — Insight Pipeline Board

### Pipeline Navigation

Implemented:

✅ 4 pipeline stages

- Observation
- Insight
- Actionable
- Impact

✅ Live stage counts

✅ Selected stage highlighting

✅ Stage switching

### Card List

Implemented:

✅ Virtualized rendering

✅ Pull-to-refresh

✅ Empty states

✅ Priority badges

✅ Category chips

✅ Relative timestamps

### Stage Movement

Implemented:

✅ Swipe-to-change stage

✅ Optimistic UI behavior

✅ GraphQL mutation updates

✅ Live pipeline count updates

Status:

⚠️ Animation refinements still in progress.

### Filters

Implemented:

✅ Search filtering

✅ Priority filtering

✅ Active filter handling

---

## Module 2 — Detail Panel + Forms

### Detail Panel

Implemented:

✅ Bottom-sheet detail modal

✅ Full insight field display

✅ Activity timeline

### Create / Edit Form

Implemented:

✅ Create flow

✅ Edit flow

✅ GraphQL mutations

✅ Real-time inline validation

✅ Unsaved changes protection

### Validation

Implemented using **Zod**.

Supported:

✅ Required validation

✅ Real-time field feedback

### Form Features

Implemented:

✅ Tags multi-select

✅ Priority selection

✅ Category editing

✅ Stage editing

✅ Drug name support

✅ Linked metadata editing

---

## Module 2.3 — Activity Logging

Implemented automatic activity tracking for:

✅ create

✅ edit

✅ move

Each activity entry records:

- actor
- changed field
- old value
- new value
- timestamp

Displayed directly within the detail timeline.

---

## Module 3 — Real-Time Collaboration

### Postgres Changes Sync

Implemented using Supabase realtime subscriptions.

Supported:

✅ INSERT synchronization

✅ UPDATE synchronization

✅ Live board updates

✅ Pipeline count synchronization

✅ Modal synchronization

✅ Subscription cleanup on unmount

### Realtime Notifications

Implemented:

Toast notifications for collaborative actions.

Example:

> Bob moved 'Supply chain...' to Insight.

### Presence — Who's Online

Implemented:

✅ Online avatar stack

✅ +N overflow indicator

✅ Presence bottom sheet

✅ Foreground/background lifecycle handling

Current status:

⚠️ Final duplicate-user edge case cleanup ongoing.

---

## Module 4 — Analytics

Implemented a dedicated analytics screen accessible through bottom navigation.

### KPI Section

Implemented:

✅ Total insights KPI

✅ Stage distribution visualization

### Analytics Chart

Implemented:

✅ Insights Over Time chart

Features:

- weekly aggregation
- last 8 week trend view

### State Handling

Implemented:

✅ Loading state

✅ Error state

✅ Retry handling

✅ Empty state

✅ Pull-to-refresh

---

# Non-Functional Requirements

Implemented:

✅ TypeScript project configuration

✅ Typed GraphQL responses

✅ Stage union typing

✅ Global Error Boundary

✅ Offline detection banner

✅ Accessibility labels (partial)

### Currently In Progress

⚠️ Zero-any cleanup

⚠️ Expanded accessibility audit

⚠️ Broader automated testing coverage

---

# Tradeoffs & Engineering Decisions

Given the assignment timeline, implementation prioritized:

1. Realtime correctness
2. Reliable GraphQL synchronization
3. Responsive mobile UX
4. Core analytics functionality

Some secondary polish work remains intentionally scoped for follow-up completion:

- animation refinement
- expanded testing
- additional accessibility coverage
- long-press “Move To…” action sheet

For realtime stability, a pragmatic hybrid state strategy was preferred over heavier cache-only approaches.

---

# Environment Setup

## Clone Repository

```bash
git clone <YOUR_REPO_URL>

cd insightboard
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create `.env`.

Example:

```env
EXPO_PUBLIC_SUPABASE_URL=

EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## Start Application

```bash
npx expo start
```

Run using Expo Go.

---

# Project Structure

```txt
src/
├── screens/
│   ├── BoardScreen.tsx
│   └── AnalyticsScreen.tsx
│
├── components/
│   ├── InsightCard.tsx
│   ├── InsightDetailModal.tsx
│   ├── InsightForm.tsx
│   ├── OfflineBanner.tsx
│   └── AppErrorBoundary.tsx
│
├── graphql/
│   ├── queries.ts
│   └── mutations.ts
│
├── services/
│   ├── realtime/
│   └── presence/
│
├── hooks/
│
└── validation/
    └── schemas.ts
```

---

# Future Improvements

Planned next improvements:

- animation polish
- long-press move action sheet
- Apollo cache optimization improvements
- expanded accessibility support
- broader automated test coverage

---

# Notes

This implementation focused heavily on **realtime collaboration behavior**, **GraphQL data consistency**, and **mobile usability under realtime multi-user scenarios**.

---
