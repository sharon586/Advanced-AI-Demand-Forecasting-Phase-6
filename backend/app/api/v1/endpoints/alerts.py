from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from datetime import datetime, timedelta
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/alerts", tags=["Alerts & Email Notifications"])

# ─── In-memory stores ────────────────────────────────────────────────────────
alerts_store: list = [
    {
        "id": 1,
        "name": "Low Forecast Accuracy",
        "description": "Fires when model accuracy drops below threshold",
        "type": "accuracy",
        "condition": "below",
        "threshold": 85.0,
        "unit": "%",
        "severity": "high",
        "channel": "both",
        "is_active": True,
        "email_recipients": ["admin@example.com"],
        "last_triggered": (datetime.utcnow() - timedelta(hours=6)).isoformat(),
        "trigger_count": 4,
        "created_at": (datetime.utcnow() - timedelta(days=30)).isoformat(),
        "updated_at": (datetime.utcnow() - timedelta(days=2)).isoformat(),
    },
    {
        "id": 2,
        "name": "High RMSE Alert",
        "description": "Fires when RMSE exceeds acceptable limit",
        "type": "rmse",
        "condition": "above",
        "threshold": 5000.0,
        "unit": "",
        "severity": "medium",
        "channel": "in-app",
        "is_active": True,
        "email_recipients": ["analyst@example.com"],
        "last_triggered": (datetime.utcnow() - timedelta(days=1)).isoformat(),
        "trigger_count": 2,
        "created_at": (datetime.utcnow() - timedelta(days=20)).isoformat(),
        "updated_at": (datetime.utcnow() - timedelta(days=1)).isoformat(),
    },
    {
        "id": 3,
        "name": "Demand Spike Detected",
        "description": "Fires when demand changes by more than threshold %",
        "type": "demand_spike",
        "condition": "above",
        "threshold": 25.0,
        "unit": "%",
        "severity": "high",
        "channel": "both",
        "is_active": True,
        "email_recipients": ["admin@example.com", "manager@example.com"],
        "last_triggered": (datetime.utcnow() - timedelta(hours=12)).isoformat(),
        "trigger_count": 7,
        "created_at": (datetime.utcnow() - timedelta(days=15)).isoformat(),
        "updated_at": (datetime.utcnow() - timedelta(days=3)).isoformat(),
    },
    {
        "id": 4,
        "name": "Critical Low Stock",
        "description": "Fires when stock will run out within N days",
        "type": "stock_level",
        "condition": "below",
        "threshold": 3.0,
        "unit": " days",
        "severity": "critical",
        "channel": "both",
        "is_active": True,
        "email_recipients": ["admin@example.com"],
        "last_triggered": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
        "trigger_count": 11,
        "created_at": (datetime.utcnow() - timedelta(days=10)).isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    },
    {
        "id": 5,
        "name": "Forecast Job Failed",
        "description": "Fires when a scheduled forecast run fails",
        "type": "forecast_failure",
        "condition": "equals",
        "threshold": 1.0,
        "unit": "",
        "severity": "high",
        "channel": "email",
        "is_active": False,
        "email_recipients": ["admin@example.com"],
        "last_triggered": (datetime.utcnow() - timedelta(days=5)).isoformat(),
        "trigger_count": 1,
        "created_at": (datetime.utcnow() - timedelta(days=8)).isoformat(),
        "updated_at": (datetime.utcnow() - timedelta(days=5)).isoformat(),
    },
    {
        "id": 6,
        "name": "Report Generation Complete",
        "description": "Fires when a report finishes generating",
        "type": "report_complete",
        "condition": "equals",
        "threshold": 1.0,
        "unit": "",
        "severity": "low",
        "channel": "in-app",
        "is_active": True,
        "email_recipients": [],
        "last_triggered": (datetime.utcnow() - timedelta(hours=3)).isoformat(),
        "trigger_count": 18,
        "created_at": (datetime.utcnow() - timedelta(days=25)).isoformat(),
        "updated_at": (datetime.utcnow() - timedelta(days=1)).isoformat(),
    },
]

alert_history_store: list = [
    {
        "id": i + 1,
        "alert_id": random.choice([1, 2, 3, 4]),
        "alert_name": random.choice(["Low Forecast Accuracy", "High RMSE Alert", "Demand Spike Detected", "Critical Low Stock"]),
        "triggered_at": (datetime.utcnow() - timedelta(hours=i * 4)).isoformat(),
        "metric_value": round(random.uniform(70, 110), 2),
        "threshold": round(random.uniform(80, 100), 2),
        "channel": random.choice(["in-app", "email", "both"]),
        "email_sent": random.choice([True, False]),
        "status": random.choice(["delivered", "delivered", "delivered", "failed"]),
        "recipients": ["admin@example.com"],
    }
    for i in range(20)
]

email_config_store = {
    "enabled": False,
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "smtp_user": "",
    "smtp_password": "",
    "from_name": "AI Forecast System",
    "from_email": "noreply@aiforecast.com",
    "use_tls": True,
    "default_recipients": ["admin@example.com"],
    "daily_digest": False,
    "digest_time": "08:00",
    "updated_at": datetime.utcnow().isoformat(),
}

# ─── Helpers ─────────────────────────────────────────────────────────────────
def _find_alert(alert_id: int):
    for a in alerts_store:
        if a["id"] == alert_id:
            return a
    return None

def _next_id():
    return max((a["id"] for a in alerts_store), default=0) + 1

def _send_email_mock(recipients: list, subject: str, body: str) -> dict:
    """Simulate sending email. Replace with real SMTP when configured."""
    cfg = email_config_store
    if not cfg["enabled"]:
        return {"sent": False, "reason": "Email notifications are disabled in config"}
    if not cfg["smtp_user"] or not cfg["smtp_password"]:
        return {"sent": False, "reason": "SMTP credentials not configured"}
    # Real implementation would use smtplib here
    return {
        "sent": True,
        "recipients": recipients,
        "subject": subject,
        "timestamp": datetime.utcnow().isoformat(),
    }

# ─── CRUD: Alerts ─────────────────────────────────────────────────────────────

@router.get("/", summary="Get All Alerts")
def get_all_alerts(
    type: Optional[str] = Query(None, description="Filter by type: accuracy | rmse | demand_spike | stock_level | forecast_failure | report_complete"),
    severity: Optional[str] = Query(None, description="Filter by severity: low | medium | high | critical"),
    is_active: Optional[bool] = Query(None),
    channel: Optional[str] = Query(None),
):
    """Return all alert configurations with optional filters."""
    data = list(alerts_store)
    if type:
        data = [a for a in data if a["type"] == type]
    if severity:
        data = [a for a in data if a["severity"] == severity]
    if is_active is not None:
        data = [a for a in data if a["is_active"] == is_active]
    if channel:
        data = [a for a in data if a["channel"] == channel]
    return {
        "alerts": data,
        "total": len(data),
        "active_count": sum(1 for a in data if a["is_active"]),
    }


@router.get("/summary", summary="Alerts Summary Stats")
def get_alerts_summary():
    """Return aggregated summary statistics for the alerts dashboard."""
    total_triggers = sum(a["trigger_count"] for a in alerts_store)
    by_severity = {}
    for sev in ["critical", "high", "medium", "low"]:
        by_severity[sev] = sum(1 for a in alerts_store if a["severity"] == sev)
    by_type = {}
    for a in alerts_store:
        by_type[a["type"]] = by_type.get(a["type"], 0) + 1
    return {
        "total_alerts": len(alerts_store),
        "active_alerts": sum(1 for a in alerts_store if a["is_active"]),
        "total_triggers_all_time": total_triggers,
        "by_severity": by_severity,
        "by_type": by_type,
        "email_enabled": email_config_store["enabled"],
        "last_triggered": max((a["last_triggered"] for a in alerts_store if a["last_triggered"]), default=None),
    }


@router.get("/{alert_id}", summary="Get Single Alert")
def get_alert(alert_id: int):
    """Return a single alert configuration by ID."""
    alert = _find_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")
    return alert


@router.post("/", status_code=201, summary="Create Alert")
def create_alert(payload: dict):
    """
    Create a new alert configuration.

    Required fields: name, type, condition, threshold
    Optional: description, unit, severity, channel, email_recipients
    """
    required = ["name", "type", "condition", "threshold"]
    missing = [f for f in required if f not in payload]
    if missing:
        raise HTTPException(status_code=422, detail=f"Missing required fields: {missing}")

    valid_types = ["accuracy", "rmse", "mae", "mape", "demand_spike", "stock_level", "forecast_failure", "report_complete", "custom"]
    if payload["type"] not in valid_types:
        raise HTTPException(status_code=422, detail=f"Invalid type. Must be one of: {valid_types}")

    valid_conditions = ["above", "below", "equals"]
    if payload["condition"] not in valid_conditions:
        raise HTTPException(status_code=422, detail=f"Invalid condition. Must be one of: {valid_conditions}")

    now = datetime.utcnow().isoformat()
    new_alert = {
        "id": _next_id(),
        "name": payload["name"],
        "description": payload.get("description", ""),
        "type": payload["type"],
        "condition": payload["condition"],
        "threshold": float(payload["threshold"]),
        "unit": payload.get("unit", ""),
        "severity": payload.get("severity", "medium"),
        "channel": payload.get("channel", "in-app"),
        "is_active": payload.get("is_active", True),
        "email_recipients": payload.get("email_recipients", []),
        "last_triggered": None,
        "trigger_count": 0,
        "created_at": now,
        "updated_at": now,
    }
    alerts_store.append(new_alert)
    return new_alert


@router.put("/{alert_id}", summary="Update Alert")
def update_alert(alert_id: int, payload: dict):
    """
    Update an existing alert configuration (partial update supported).
    Any combination of fields can be updated.
    """
    alert = _find_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")

    updatable = ["name", "description", "type", "condition", "threshold", "unit",
                 "severity", "channel", "is_active", "email_recipients"]
    for key in updatable:
        if key in payload:
            alert[key] = payload[key]
    alert["updated_at"] = datetime.utcnow().isoformat()
    return alert


@router.delete("/{alert_id}", summary="Delete Alert")
def delete_alert(alert_id: int):
    """Permanently delete an alert configuration."""
    global alerts_store
    alert = _find_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")
    alerts_store = [a for a in alerts_store if a["id"] != alert_id]
    return {"message": f"Alert '{alert['name']}' (id={alert_id}) deleted successfully"}


@router.put("/{alert_id}/toggle", summary="Toggle Alert Active/Inactive")
def toggle_alert(alert_id: int):
    """Enable or disable an alert without deleting it."""
    alert = _find_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")
    alert["is_active"] = not alert["is_active"]
    alert["updated_at"] = datetime.utcnow().isoformat()
    state = "enabled" if alert["is_active"] else "disabled"
    return {"message": f"Alert '{alert['name']}' {state}", "alert": alert}


# ─── Test Alert ───────────────────────────────────────────────────────────────

@router.post("/{alert_id}/test", summary="Generate Test Alert")
def generate_test_alert(alert_id: int):
    """
    Fire a test notification for the given alert.
    - Sends in-app notification
    - Sends email if channel is 'email' or 'both' and email is configured
    - Records test event in alert history
    """
    alert = _find_alert(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")

    now = datetime.utcnow().isoformat()
    # Simulate a metric value that would have triggered this alert
    metric_value = (alert["threshold"] * 0.85
                    if alert["condition"] == "above"
                    else alert["threshold"] * 1.15)

    # Attempt email
    email_result = {"sent": False, "reason": "channel is in-app only"}
    if alert["channel"] in ("email", "both"):
        recipients = alert["email_recipients"] or email_config_store["default_recipients"]
        subject = f"[TEST] AI Forecast Alert — {alert['name']}"
        body = (
            f"This is a TEST notification for alert: {alert['name']}\n\n"
            f"Condition: {alert['type']} {alert['condition']} {alert['threshold']}{alert['unit']}\n"
            f"Simulated metric value: {round(metric_value, 2)}{alert['unit']}\n"
            f"Severity: {alert['severity']}\n\n"
            f"— AI Demand Forecasting Platform"
        )
        email_result = _send_email_mock(recipients, subject, body)

    # Record in history
    history_entry = {
        "id": len(alert_history_store) + 1,
        "alert_id": alert_id,
        "alert_name": alert["name"],
        "triggered_at": now,
        "metric_value": round(metric_value, 2),
        "threshold": alert["threshold"],
        "channel": alert["channel"],
        "email_sent": email_result.get("sent", False),
        "status": "delivered",
        "recipients": alert.get("email_recipients", []),
        "is_test": True,
    }
    alert_history_store.append(history_entry)
    alert["last_triggered"] = now
    alert["trigger_count"] += 1

    return {
        "message": f"Test alert fired for '{alert['name']}'",
        "alert_id": alert_id,
        "in_app_sent": True,
        "email_result": email_result,
        "history_entry": history_entry,
    }


# ─── Threshold Check ──────────────────────────────────────────────────────────

@router.post("/check-threshold", summary="Check Metric Against All Active Thresholds")
def check_threshold(payload: dict):
    """
    Evaluate a live metric value against all active alert thresholds.

    Body:
        {
          "metric_type": "accuracy",   // matches alert 'type'
          "metric_value": 78.5,
          "context": "Electronics - Random Forest run"  // optional label
        }

    Returns every alert that would fire for the given value.
    """
    metric_type = payload.get("metric_type")
    metric_value = payload.get("metric_value")
    context = payload.get("context", "manual check")

    if metric_type is None or metric_value is None:
        raise HTTPException(status_code=422, detail="Both 'metric_type' and 'metric_value' are required")

    metric_value = float(metric_value)
    now = datetime.utcnow().isoformat()
    triggered = []
    checked = []

    for alert in alerts_store:
        if alert["type"] != metric_type:
            continue
        if not alert["is_active"]:
            continue

        threshold = float(alert["threshold"])
        fired = False
        if alert["condition"] == "above" and metric_value > threshold:
            fired = True
        elif alert["condition"] == "below" and metric_value < threshold:
            fired = True
        elif alert["condition"] == "equals" and abs(metric_value - threshold) < 0.001:
            fired = True

        checked.append({
            "alert_id": alert["id"],
            "alert_name": alert["name"],
            "condition": f"{metric_type} {alert['condition']} {threshold}{alert['unit']}",
            "fired": fired,
        })

        if fired:
            # Update alert record
            alert["last_triggered"] = now
            alert["trigger_count"] += 1
            alert["updated_at"] = now

            # Attempt email
            email_result = {"sent": False}
            if alert["channel"] in ("email", "both"):
                recipients = alert["email_recipients"] or email_config_store["default_recipients"]
                subject = f"[ALERT] {alert['name']} — AI Forecast Platform"
                body = (
                    f"Alert triggered: {alert['name']}\n\n"
                    f"Metric: {metric_type}\n"
                    f"Current value: {metric_value}{alert['unit']}\n"
                    f"Threshold: {alert['condition']} {threshold}{alert['unit']}\n"
                    f"Severity: {alert['severity']}\n"
                    f"Context: {context}\n\n"
                    f"— AI Demand Forecasting Platform"
                )
                email_result = _send_email_mock(recipients, subject, body)

            # Add to history
            history_entry = {
                "id": len(alert_history_store) + 1,
                "alert_id": alert["id"],
                "alert_name": alert["name"],
                "triggered_at": now,
                "metric_value": metric_value,
                "threshold": threshold,
                "channel": alert["channel"],
                "email_sent": email_result.get("sent", False),
                "status": "delivered",
                "recipients": alert.get("email_recipients", []),
                "is_test": False,
                "context": context,
            }
            alert_history_store.append(history_entry)

            triggered.append({
                "alert_id": alert["id"],
                "alert_name": alert["name"],
                "severity": alert["severity"],
                "condition": f"{metric_type} {alert['condition']} {threshold}{alert['unit']}",
                "metric_value": metric_value,
                "channel": alert["channel"],
                "email_result": email_result,
            })

    return {
        "metric_type": metric_type,
        "metric_value": metric_value,
        "context": context,
        "alerts_checked": len(checked),
        "alerts_triggered": len(triggered),
        "triggered": triggered,
        "checked": checked,
        "timestamp": now,
    }


# ─── Alert History ────────────────────────────────────────────────────────────

@router.get("/history/all", summary="Get Alert Trigger History")
def get_alert_history(
    alert_id: Optional[int] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
):
    """Return the history of all triggered alerts, newest first."""
    data = list(reversed(alert_history_store))
    if alert_id is not None:
        data = [h for h in data if h["alert_id"] == alert_id]
    if status:
        data = [h for h in data if h.get("status") == status]
    return {"history": data[:limit], "total": len(data)}


# ─── Email Configuration ──────────────────────────────────────────────────────

@router.get("/email/config", summary="Get Email Notification Config")
def get_email_config():
    """Return current SMTP / email notification configuration (password masked)."""
    cfg = dict(email_config_store)
    if cfg.get("smtp_password"):
        cfg["smtp_password"] = "••••••••"
    return cfg


@router.put("/email/config", summary="Update Email Notification Config")
def update_email_config(payload: dict):
    """
    Update SMTP and email notification settings.

    Accepted fields: enabled, smtp_host, smtp_port, smtp_user, smtp_password,
                     from_name, from_email, use_tls, default_recipients,
                     daily_digest, digest_time
    """
    updatable = [
        "enabled", "smtp_host", "smtp_port", "smtp_user", "smtp_password",
        "from_name", "from_email", "use_tls", "default_recipients",
        "daily_digest", "digest_time",
    ]
    for key in updatable:
        if key in payload:
            email_config_store[key] = payload[key]
    email_config_store["updated_at"] = datetime.utcnow().isoformat()

    cfg = dict(email_config_store)
    if cfg.get("smtp_password"):
        cfg["smtp_password"] = "••••••••"
    return {"message": "Email configuration updated", "config": cfg}


@router.post("/email/test", summary="Send Test Email")
def send_test_email(payload: dict):
    """
    Send a test email to verify SMTP configuration.

    Body: { "recipient": "test@example.com" }
    """
    recipient = payload.get("recipient") or email_config_store["default_recipients"][0]
    result = _send_email_mock(
        recipients=[recipient],
        subject="[TEST] AI Forecast — Email Notification Working",
        body=(
            "This is a test email from the AI Demand Forecasting Platform.\n\n"
            "If you received this, your email notification setup is working correctly.\n\n"
            "— AI Demand Forecasting Platform"
        ),
    )
    if result["sent"]:
        return {"message": f"Test email sent to {recipient}", "result": result}
    else:
        return {"message": "Email not sent", "reason": result.get("reason"), "result": result}


@router.get("/email/logs", summary="Get Email Send Logs")
def get_email_logs(limit: int = Query(20)):
    """Return recent email send history from alert triggers."""
    email_events = [h for h in reversed(alert_history_store) if h.get("email_sent") is not None]
    return {
        "logs": email_events[:limit],
        "total": len(email_events),
        "sent_count": sum(1 for e in email_events if e.get("email_sent")),
        "failed_count": sum(1 for e in email_events if not e.get("email_sent")),
    }
