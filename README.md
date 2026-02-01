# Technical Calibration & Project Roadmap: Kunlik Hisobot

This document serves as the formal response to the technical and coordination inquiry regarding the development of the "Kunlik Hisobot" Telegram Mini App.

## 1. Availability & Synchronous Calibration
Acknowledging the time zone difference (**UTC+5 vs UTC+3**) and current professional commitments:

*   **Estimated Capacity:** ~15 hours per week (Avg. 2-3 hours/day + weekend flexibility).
*   **Daily Status (Tashkent Time - UTC+5):**
    *   **09:00 - 20:00: "Busy"** (Bank Internship). Available for asynchronous chat checks only.
    *   **20:00 - 23:00: "Available/Tentative"** (Primary development and meeting slot). 
*   **Sync Window (Professor's Time - UTC+3):**
    *   The 20:00 (UTC+5) start aligns with **18:00 (UTC+3)**. This provides a high-quality 2-3 hour window where our schedules overlap for team meetings or synchronous interaction.
*   **Weekend Status:** "Tentative" - Slots can be booked 24h in advance for longer sessions.

## 2. Infrastructure & Development Stack
The architecture is designed for scalability, low latency (critical for Telegram Mini Apps), and cost-efficiency.

### **Version Control & CI/CD**
*   **VCS:** GitHub (Private Repository).
*   **Flow:** Trunk-based development with feature branches for specific components (Dashboard, AI Integration).
*   **CI/CD:** Automatic deployments to Vercel (Frontend) and Railway (Backend) on `main` branch merges.

### **Technology Stack**
*   **Frontend (The Mini App):** React 19 (ES6+) + TypeScript. Optimized using Vite for near-instant loading times within the Telegram environment.
*   **Backend (The Bot):** Python 3.12+ using the `Aiogram` framework (Asynchronous I/O) to handle concurrent user requests efficiently.
*   **Database:** 
    *   *Development:* SQLite (Local persistence).
    *   *Production:* PostgreSQL (via Railway Managed Database).
*   **AI Engine:** Google Gemini API (`gemini-3-flash-preview`) for real-time productivity insights and JSON-schema-validated task analysis.

### **Cloud & Environment**
*   **Cloud Providers:** 
    *   **Vercel:** Global Edge Network for hosting the React frontend.
    *   **Railway.app:** For hosting the Python bot and PostgreSQL instance (preferred for its superior DX and seamless container orchestration).
*   **Licenses:** MIT License for custom code; utilizing Google's API free-tier for initial development/testing.

## 3. Immediate Milestones (Next 7 Days)
1.  **Finalize UI/UX:** Complete the Task Transfer logic and AI Assistant visualization in the React frontend.
2.  **Bot Skeleton:** Deploy basic `Aiogram` bot to handle the `/start` command and launch the WebApp.
3.  **API Integration:** Securely wire the Gemini API keys through environment variables for production-ready insights.

---
*Prepared by the Development Team for Kunlik Hisobot.*