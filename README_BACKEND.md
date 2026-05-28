# Kaizen Realtime Backend Setup Guide

Kaizen is powered by a high-performance, cost-effective hybrid architecture using **Supabase** as the primary database/auth provider and **Firebase Cloud Messaging (FCM)** exclusively for mobile push notifications.

---

## 🛠️ Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18+)
* [Git](https://git-scm.com/)
* [Expo Go](https://expo.dev/go) app installed on your physical test device

---

## 🚀 1. Supabase Setup (Primary Backend)

Supabase handles:
* **Authentication**: Secure email/password login, Google, Apple SSO, JWT sessions.
* **Database**: High-speed, normalized PostgreSQL schemas with Row-Level Security (RLS) policies.
* **Realtime Subscriptions**: Live activity feeds, friend request status, chat messaging, and streaks.

### **Steps:**
1. Go to [Supabase](https://supabase.com/) and create a new free-tier project.
2. In the left navigation, click on **SQL Editor** -> **New Query**.
3. Copy the entire contents of the [`supabase_schema.sql`](./supabase_schema.sql) file located in the root of this project and paste it into the SQL editor.
4. Click **Run** to execute the script. This will create:
   * Tables: `profiles`, `habits`, `habit_logs`, `friendships`, `friend_requests`, `activities`, `reactions`, `comments`, `challenges`, `challenge_members`, `chat_messages`.
   * Triggers: Automatic profile creation upon signup, dynamic friend counter updates, and challenge member tallying.
   * Policies: Row Level Security (RLS) to enforce privacy permissions.
5. In Supabase, go to **Project Settings** -> **API**.
6. Copy your **Project URL** and **Anon Public Key**.

---

## 🔑 2. Environment Variables Configuration

To connect the React Native app to your live backend:

1. Locate the `.env` template file at the root of the `Kaizen` directory.
2. Fill in the keys:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Expo will automatically load these environment variables when starting the development server.

---

## 🔔 3. Firebase Cloud Messaging (FCM) Setup

Firebase is used **exclusively** for dispatching push notifications (streak reminders, friend alerts, etc.).

### **Steps:**
1. Visit the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Register an Android/iOS app with your project package name.
3. In **Project Settings** -> **Cloud Messaging**, enable the Firebase Cloud Messaging API.
4. Download the configuration file:
   * **Android**: `google-services.json` (place in your app's root folder).
   * **iOS**: `GoogleService-Info.plist` (place in your app's root folder).
5. For Expo Go testing, push notifications work out of the box using Expo's push notification tool with FCM configuration. Follow [Expo Push Notification Documentation](https://docs.expo.dev/push-notifications/overview/) to link FCM credentials.

---

## 🏃‍♂️ 4. Launching the App

Start the development server and run the mobile application:

```bash
# 1. Install dependencies
npm install

# 2. Run Expo development server (clearing cache to ensure env updates)
npx expo start -c
```

Scan the QR code printed in the terminal with your **Expo Go** application to test the live backend, auth, and realtime subscriptions!
