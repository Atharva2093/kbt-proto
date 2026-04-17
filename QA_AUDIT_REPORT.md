# QA Audit Report: ThermalWall AI

**Date:** April 17, 2026  
**Auditor:** Senior QA Engineer (Antigravity)  
**Status:** 🔴 MAJOR ISSUES DETECTED

---

## 1. Executive Summary
The ThermalWall AI system demonstrates a successful implementation of core engineering calculations and AI-driven optimization. However, the application is currently hindered by a **critical navigation flaw** that causes data context loss and **major graphical rendering bugs** in the Reports module. While the authentication and procurement flows are robust, the reporting and dashboard metrics require immediate attention to ensure engineering accuracy and professional usability.

---

## 2. Pass/Fail Matrix per Module

| Module | Status | Core Functionality | UI Quality |
| :--- | :---: | :--- | :--- |
| **Authentication** | ✅ PASS | Google Auth + Sync is solid. | Minimal. |
| **Dashboard** | ⚠️ MAJOR | Data loads; Metrics present. | Unit/Label mismatch. |
| **Thermal Analysis** | ✅ PASS | Calc engine is accurate. | High. |
| **AI Optimization** | ✅ PASS | Gemini integration is stable. | High. |
| **Material List** | ❌ FAIL | Optimized data resolved. | Missing savings context. |
| **Procurement** | ✅ PASS | 10% Waste logic is correct. | Good. |
| **Reports** | ❌ FAIL | Snapshot logic is sound. | **BROKEN** graph lines. |
| **Settings** | ✅ PASS | Profile updates persist. | Good. |

---

## 3. Critical Bugs (Blocking)

### [BUG-001] Sidebar Navigation Context Loss
- **Severity:** Critical
- **Module:** Global / Navigation
- **Description:** Clicking sidebar links (e.g., Thermal Analysis -> Materials) strips the `projectId` from the URL.
- **Expected:** The `projectId` should persist across all dashboard modules to maintain the user's active context.
- **Actual:** User is redirected to a blank state or "No Project Selected" view.
- **Reproduction:**
  1. Open a project from the Dashboard.
  2. Click "Procurement" in the sidebar.
  3. Observe the URL change from `?projectId=xyz` to just `/procurement`.

### [BUG-002] Broken Thermal Gradient Lines
- **Severity:** Critical
- **Module:** Reports
- **Description:** In the "Thermal Gradient Profile" line chart, only data points (dots) are displayed. The connecting lines are invisible.
- **Expected:** A continuous line representing the temperature gradient through the wall.
- **Actual:** Floating dots with no connectivity.
- **Reproduction:** Generate any report and view the detailed snapshot.

---

## 4. Major Issues

### [BUG-003] Dashboard Metric Unit Mismatch
- **Severity:** Major
- **Module:** Dashboard
- **Description:** "Last Heat Loss" metric is labeled in `W/m²` (Heat Flux), but the value shown is total system heat loss in `W`.
- **Expected:** If the label is `W/m²`, the value should be divided by the total area.
- **Actual:** Total heat loss (e.g., 850W) is shown next to the unit `W/m²`.

### [BUG-004] Material List Financial Sync Failure
- **Severity:** Major
- **Module:** Material List
- **Description:** Savings and Payback Period do not populate after AI Optimization.
- **Expected:** Calculated savings based on the efficiency gain should appear.
- **Actual:** Values show "$0" or "N/A".

---

## 5. Minor Issues / UX

### [UX-001] Overlapping Graph Axis Labels
- **Severity:** Minor
- **Module:** Reports
- **Description:** X-axis labels for material thickness are unformatted digits that overlap (e.g., `50100150`).
- **Reproduction:** View any report with more than 3 layers.

### [UX-002] Hydration Inconsistency
- **Severity:** Minor
- **Module:** Global
- **Description:** A Next.js hydration mismatch warning is triggered by the `antigravity-scroll-lock` class injected into the body.

---

## 6. UI & Graph Audit (Fix Recommendations)

### Findings
- **Color Divergence:** Analysis graphs use a vibrant primary blue, while Report graphs use a darker, desaturated palette.
- **Contrast Ratios:** Axis labels in Dark Mode (Reports) fail WCAG AA contrast requirements.

### Suggested Fixes (Theme Definition)
We recommend implementing a unified chart theme using the following color tokens:

| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Primary** | `#3B82F6` | Main data lines (Optimized) |
| **Secondary** | `#10B981` | Efficiency Gains / Green zones |
| **Baseline** | `#64748B` | Original Design / Muted data |
| **Gridlines** | `#1E293B` | Chart Background Grids |
| **Labels** | `#F8FAFC` | High-contrast axis text |

**Recommendation:** 
- In `Line` and `Bar` charts, set `connectNulls={true}` and `strokeWidth={2}`.
- Apply `tickFormatter` to all X-Axis components to add units (e.g., `(val) => `${val}mm``).

---

## 7. Security & Auth Findings
- **Auth Header:** ✅ Verified. All API requests correctly include the Bearer token.
- **Cross-User Data:** ✅ Verified. All database queries are scoped to the current `userId`.
- **Session Persistence:** ✅ Verified. Firebase `onAuthStateChanged` correctly manages session restoration.

---

## 8. Performance Observations
- **Optimization Latency:** The AI engine takes ~3-5 seconds to return results. A skeleton loader is already implemented, providing a good user experience.
- **Database Indexing:** Large material lists load instantly (<200ms).

---

**End of Report**
