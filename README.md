# Advanced AI Demand Forecasting — Phase 6

Enterprise AI-powered Demand Forecasting Platform — Phase 6: Complete Enterprise Ecosystem with multi-org support, approval workflows, governance, and strategic planning.

---

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS demand_forecasting;"
uvicorn app.main:app --reload --port 8000
```
Swagger docs: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:5173

**Login:** `admin@example.com` / `admin123`

---

##  Phase 6 — New Modules (9 pages + 9 backend endpoints)

| Module | Route | Description |
|--------|-------|-------------|
| **Organization Management** | `/organizations` | Multi-org creation, member management, per-org dashboards & settings |
| **Approval Workflow** | `/approval-workflow` | Submit forecasts for review, approve/reject with comments, full audit trail |
| **Workflow Automation** | `/workflow-automation` | Visual multi-step workflow builder, execution logs, trigger management |
| **Strategic Planning** | `/strategic-planning` | Annual & quarterly planning dashboards, target tracking, AI recommendations |
| **Governance Center** | `/governance` | Version control, modification log, approval records, lifecycle management |
| **KPI Management** | `/kpi-management` | Custom KPI creation, trend charts, threshold alerts, performance reports |
| **Data Quality** | `/data-quality` | Quality scoring, issue detection, dataset validation, on-demand scan |
| **Command Center** | `/command-center` | Org-wide analytics, executive metrics, strategic insights, alert center |
| **Notification Center** | `/notification-center` | Full inbox management, per-event preferences, announcements, history |

---

##  Complete Route Map (37 routes)

| Route | Module | Phase |
|-------|--------|-------|
| `/dashboard` | Dashboard | Core |
| `/forecast` | Forecast | Core |
| `/forecast/history` | Forecast History | Core |
| `/upload` | Upload Dataset | Core |
| `/reports` | Reports | Core |
| `/analytics` | Advanced Analytics | Core |
| `/realtime` | Real-Time Monitor | Core |
| `/notifications` | Notifications | Core |
| `/settings` | Settings | Core |
| `/admin` | Admin Dashboard | Core |
| `/roles` | Role Management | Core |
| `/system` | System Monitor | Core |
| `/mlops` | ML Ops | Core |
| `/forecast-comparison` | Model Comparison | Phase 4 |
| `/ai-features` | AI Features | Phase 4 |
| `/automation` | Smart Automation | Phase 4 |
| `/integrations` | Integrations | Phase 4 |
| `/user-management` | User Management | Phase 4 |
| `/workspace` | Forecast Workspaces | Phase 5 |
| `/executive-dashboard` | Executive Dashboard | Phase 5 |
| `/scenario-planning` | Scenario Planning | Phase 5 |
| `/ai-insights` | AI Insights Engine | Phase 5 |
| `/collaboration` | Collaboration | Phase 5 |
| `/data-management` | Data Management | Phase 5 |
| `/accuracy-center` | Accuracy Center | Phase 5 |
| `/executive-reports` | Executive Reports | Phase 5 |
| **`/organizations`** | Organization Management | **Phase 6** |
| **`/approval-workflow`** | Approval Workflow | **Phase 6** |
| **`/workflow-automation`** | Workflow Automation | **Phase 6** |
| **`/strategic-planning`** | Strategic Planning | **Phase 6** |
| **`/governance`** | Governance Center | **Phase 6** |
| **`/kpi-management`** | KPI Management | **Phase 6** |
| **`/data-quality`** | Data Quality | **Phase 6** |
| **`/command-center`** | Command Center | **Phase 6** |
| **`/notification-center`** | Notification Center | **Phase 6** |

---

##  Phase 6 API Endpoints

### Organizations `/organizations`
- `GET /organizations/` — List all orgs
- `POST /organizations/` — Create org
- `GET /organizations/summary` — Platform stats
- `GET /organizations/{id}` — Get org
- `PUT /organizations/{id}` — Update org
- `DELETE /organizations/{id}` — Delete org
- `GET /organizations/{id}/members` — Get members
- `POST /organizations/{id}/members` — Add member
- `GET /organizations/{id}/dashboard` — Org dashboard

### Approval Workflow `/approvals`
- `GET /approvals/` — List approvals (filterable)
- `GET /approvals/summary` — Stats
- `POST /approvals/` — Submit for approval
- `PUT /approvals/{id}/approve` — Approve
- `PUT /approvals/{id}/reject` — Reject
- `PUT /approvals/{id}/reassign` — Reassign reviewer
- `GET /approvals/audit/trail` — Audit trail

### Workflow Automation `/workflows`
- `GET /workflows/` — List workflows
- `POST /workflows/` — Create workflow
- `PUT /workflows/{id}` — Update
- `PUT /workflows/{id}/toggle` — Enable/disable
- `POST /workflows/{id}/execute` — Run now
- `DELETE /workflows/{id}` — Delete
- `GET /workflows/logs/all` — Execution logs

### Strategic Planning `/strategic`
- `GET /strategic/annual-plan` — Annual dashboard
- `GET /strategic/quarterly-plan` — Quarterly dashboard
- `GET /strategic/targets` — Target tracking
- `GET /strategic/forecast-vs-target` — Comparison
- `GET /strategic/recommendations` — AI recommendations

### Governance `/governance`
- `GET /governance/dashboard` — Overview stats
- `GET /governance/versions` — Version control
- `POST /governance/versions` — Create version
- `GET /governance/modifications` — Modification log
- `GET /governance/approval-records` — Audit records
- `GET /governance/lifecycle` — Lifecycle management

### KPI Management `/kpis`
- `GET /kpis/` — List KPIs
- `POST /kpis/` — Create custom KPI
- `GET /kpis/{id}` — KPI with trend data
- `PUT /kpis/{id}` — Update
- `DELETE /kpis/{id}` — Delete
- `GET /kpis/report/performance` — Performance report

### Data Quality `/data-quality`
- `GET /data-quality/` — All quality reports
- `GET /data-quality/dashboard` — Summary
- `GET /data-quality/{dataset_id}` — Dataset report
- `POST /data-quality/{dataset_id}/scan` — Trigger scan
- `GET /data-quality/report/generate` — Full report
- `GET /data-quality/validate/{dataset_id}` — Validation

### Command Center `/command-center`
- `GET /command-center/overview` — Platform overview
- `GET /command-center/executive-metrics` — Exec KPIs
- `GET /command-center/strategic-insights` — Insights
- `GET /command-center/performance-summaries` — Per-org
- `GET /command-center/alert-center` — Alert center

### Notification Center `/notification-center`
- `GET /notification-center/` — Get notifications
- `PUT /notification-center/{id}/read` — Mark read
- `PUT /notification-center/read-all` — Mark all read
- `DELETE /notification-center/{id}` — Delete
- `GET /notification-center/preferences/{email}` — Get prefs
- `PUT /notification-center/preferences/{email}` — Update prefs
- `GET /notification-center/announcements` — Announcements
- `POST /notification-center/announcements` — Create
- `PUT /notification-center/announcements/{id}/toggle` — Toggle
- `GET /notification-center/history` — History

---

##  Project Structure

```
project_v6/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/          # 39 endpoint files
│   │   │   ├── organizations.py        ← Phase 6
│   │   │   ├── approval_workflow.py    ← Phase 6
│   │   │   ├── workflow_automation.py  ← Phase 6
│   │   │   ├── strategic_planning.py   ← Phase 6
│   │   │   ├── governance.py           ← Phase 6
│   │   │   ├── kpi_management.py       ← Phase 6
│   │   │   ├── data_quality.py         ← Phase 6
│   │   │   ├── command_center.py       ← Phase 6
│   │   │   ├── notification_center.py  ← Phase 6
│   │   │   └── ... (Phase 1-5)
│   │   └── main.py  (v6.0.0)
│   └── requirements.txt
└── frontend/
    └── src/
        ├── pages/                      # 37 pages
        │   ├── OrgManagement.jsx       ← Phase 6
        │   ├── ApprovalWorkflow.jsx    ← Phase 6
        │   ├── WorkflowAutomation.jsx  ← Phase 6
        │   ├── StrategicPlanning.jsx   ← Phase 6
        │   ├── GovernanceCenter.jsx    ← Phase 6
        │   ├── KPIManagement.jsx       ← Phase 6
        │   ├── DataQuality.jsx         ← Phase 6
        │   ├── CommandCenter.jsx       ← Phase 6
        │   ├── NotificationCenter.jsx  ← Phase 6
        │   └── ... (Phase 1-5)
        ├── components/layout/
        │   └── Sidebar.jsx  (5 nav groups)
        └── App.jsx  (37 routes)
```
