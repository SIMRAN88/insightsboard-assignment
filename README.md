# InsightBoard — Realtime Collaborative Insight Management App

Frontend engineering assignment implementation for Speer Health.

InsightBoard is a React Native mobile application designed for pharmaceutical teams to capture, organize, and collaborate on Healthcare Provider (HCP) insights.

The application provides a multi-stage insight pipeline, realtime collaboration between users, presence awareness, activity tracking, and analytics dashboards powered by GraphQL and Supabase realtime infrastructure.

Built with a strong focus on **realtime correctness**, **mobile UX**, and **responsive collaborative behavior**.

---


<img width="400" height="900" alt="A13E6546-2A6C-40D3-8D51-6EA970AA200F" src="https://github.com/user-attachments/assets/6a119a67-fabc-45ee-a648-c7011df558f8" />
<img width="400" height="900" alt="824EBCDB-C835-4B1E-A71D-4125D21270EB" src="https://github.com/user-attachments/assets/a1aa5c15-8908-4f43-9987-63b78b560fe5" />
<img width="400" height="900" alt="620E72CF-E3A5-4A89-8F86-E1588A6DD5FC" src="https://github.com/user-attachments/assets/46b1bf2a-be82-485b-8892-9e50f81e4759" />
<img width="400" height="900" alt="398FACDE-93FF-4B96-B103-49BF03656942" src="https://github.com/user-attachments/assets/4068dec8-97a4-41b9-978f-df4df40e9c3d" />
<img width="400" height="900" alt="08B086E9-551C-4723-9F5C-ADF63FECC612" src="https://github.com/user-attachments/assets/cf543944-a47d-4a23-a9a1-90db13827d0e" />
<img width="400" height="900" alt="2AF64C17-4687-4AF2-938A-6D98269750B7" src="https://github.com/user-attachments/assets/ca6ed193-d681-4a25-9c3a-7544c04d515c" />
<img width="418" height="760" alt="Screenshot 2026-05-20 at 7 04 36 PM" src="https://github.com/user-attachments/assets/ad301586-453a-4ee6-8511-c3757fee4d61" />
<img width="418" height="760" alt="Screenshot 2026-05-20 at 7 02 30 PM" src="https://github.com/user-attachments/assets/99502cdf-3a0e-4374-9e36-65092ecba01a" />
<img width="417" height="871" alt="Screenshot 2026-05-20 at 7 02 04 PM" src="https://github.com/user-attachments/assets/7bdb57b6-d4af-4009-829b-ac7e965500b7" />
<img width="417" height="871" alt="Screenshot 2026-05-20 at 7 01 15 PM" src="https://github.com/user-attachments/assets/ff31764a-2646-4b38-8967-902ac30274eb" />


# Demo

###Walkthrough

https://drive.google.com/file/d/1_V9fwfs-ewNtRveGMy44lanU01Hrst_S/view?usp=drive_link

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
