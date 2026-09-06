# 🏛️ Midlex LLP - Full-Stack Legal Platform & Mobile Application

[![Vercel](https://img.shields.io/badge/Vercel-Frontend_Live-000000?style=for-the-badge&logo=vercel)](https://midlex-llplawfirm.vercel.app)
[![Render](https://img.shields.io/badge/Render-Backend_Live-46E3B7?style=for-the-badge&logo=render)](https://midlex-backend.onrender.com)
[![Flutter](https://img.shields.io/badge/Flutter-Mobile_App-02569B?style=for-the-badge&logo=flutter)](./mobile)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](./frontend)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs)](./backend)

**Midlex LLP** is a modern, enterprise-grade full-stack legal management platform and cross-platform mobile application designed for law firms in Nigeria. It features a public-facing corporate website, consultation booking engine, client portal, lawyer dashboard, administrative panel, real-time case discussions via WebSockets, and a Flutter mobile app.

---

## 🌟 Key Features

### 🌐 Public Marketing Website
- **Hero & Firm Overview**: Professional landing page highlighting firm legal capabilities, partners, and core values.
- **Practice Areas & Service Breakdown**: Interactive pages for Real Estate & Property Law, Corporate Advisory, Commercial Litigation, Energy Law, Tax Advisory, and Intellectual Property.
- **Legal Team Directory**: Profiles for partners, senior associates, and counsel.
- **Legal Insights Reader**: Articles and blog posts on legal developments.
- **Consultation Booking Engine**: Online scheduling for initial client consultations.

### 💼 Client, Lawyer & Admin Dashboards
- **Role-Based Portals**:
  - **Client Portal**: View active legal cases, track case progress, upload documents, communicate with assigned lawyers, and view fee payment history.
  - **Lawyer Dashboard**: Manage assigned cases, review client files, schedule court hearing dates, and communicate with clients.
  - **Admin Panel**: Firm analytics, client directory, lawyer assignments, payment verification, and website inquiry management.
- **Real-Time Messaging**: Case discussion widget supporting live messaging and file attachments.
- **Document Vault**: Upload, organize, and view legal contracts and case files.
- **Court Schedule Calendar**: Track upcoming court appearances, locations, and hearing summaries.

### 📱 Flutter Mobile Application (`mobile/`)
- **Native Cross-Platform**: Android and iOS client application mirroring website and dashboard functionality.
- **Animated Splash Screen**: Custom branded launch screen with animated logo and automatic auth routing.
- **Real-Time Data Sync**: Directly integrated with backend REST API endpoints.

---

## 🏗️ Architecture & Tech Stack

```text
Midlex-LLP/
├── frontend/             # Next.js 16 (React 19, Tailwind CSS v4, Framer Motion)
├── backend/              # NestJS 11 (TypeScript, Socket.io, JWT Auth, Local/Firebase DB)
├── mobile/               # Flutter Mobile App (Dart, Provider, Material 3)
└── start-offline.bat     # One-click offline local launcher
```

| Layer | Technologies Used |
| :--- | :--- |
| **Web Frontend** | Next.js 16, React 19, Tailwind CSS v4, Lucide Icons, Framer Motion |
| **Mobile App** | Flutter 3, Dart, Provider State Management, Google Fonts |
| **Backend API** | NestJS 11, Node.js, Socket.io WebSockets, JWT Authentication |
| **Database** | Firebase Firestore / Local File Store JSON (Offline Mode) |
| **Hosting & Cloud** | Vercel (Frontend), Render.com (Backend API), Firebase Storage |

---

## 🚀 Live Deployment Links

- 🌐 **Web Application**: [https://midlex-llplawfirm.vercel.app](https://midlex-llplawfirm.vercel.app)
- 🔒 **Client & Staff Login**: [https://midlex-llplawfirm.vercel.app/login](https://midlex-llplawfirm.vercel.app/login)
- ⚙️ **API Service**: [https://midlex-backend.onrender.com](https://midlex-backend.onrender.com)

---

## 🔑 Default Test Accounts

Use these default credentials to test the platform role features:

| Role | Email Address | Default Password |
| :--- | :--- | :--- |
| **Super Admin** | `midlexllp01@gmail.com` | `Admin@123` |
| **Senior Lawyer** | `lawyer1@midlex.com` | `admin123` |

---

## ⚙️ Local Development & Setup

### Prerequisites
- [Node.js v20+](https://nodejs.org/)
- [Flutter SDK v3+](https://flutter.dev/) (For mobile app)

### 1. Backend Setup (`backend/`)
```bash
cd backend
npm install
npm run start:dev
```
Backend server starts on `http://localhost:3001`.

### 2. Frontend Setup (`frontend/`)
```bash
cd frontend
npm install
npm run dev
```
Frontend web application starts on `http://localhost:3000`.

### 3. Flutter Mobile App Setup (`mobile/`)
```bash
cd mobile
flutter pub get
flutter run
```

### ⚡ 1-Click Offline Local Launcher (Windows)
Double-click `start-offline.bat` to automatically launch both backend and frontend servers in separate command windows.

---

## 📜 License & Copyright

© Midlex LLP. All Rights Reserved.  
Headquartered in Benin City, Edo State, Nigeria.
