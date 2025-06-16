export interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  adminEmail: string;
}

const AUDIT_LOG_KEY = 'admin_audit_log';

export function logAdminAction(action: string, details: string): void {
  try {
    const session = localStorage.getItem('admin_session');
    if (!session) return;

    const { email } = JSON.parse(session);
    const log: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      action,
      details,
      adminEmail: email
    };

    const logs = getAuditLogs();
    logs.unshift(log);

    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.length = 1000;
    }

    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
}

export function getAuditLogs(): AuditLog[] {
  try {
    const logs = localStorage.getItem(AUDIT_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting audit logs:', error);
    return [];
  }
}

export function clearAuditLogs(): void {
  localStorage.setItem(AUDIT_LOG_KEY, '[]');
}