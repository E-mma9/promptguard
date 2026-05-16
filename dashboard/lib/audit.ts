export type AuditEventType =
  | 'auth.login.success'
  | 'auth.login.failed'
  | 'auth.signup'
  | 'auth.logout'
  | 'auth.login.rate_limited'
  | 'api.ingest.rate_limited'
  | 'api.report.exported'
  | 'api.apikey.regenerated'
  | 'access.denied';

export interface AuditEvent {
  type: AuditEventType;
  userId?: string;
  orgId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

export function auditLog(event: AuditEvent): void {
  const entry = {
    timestamp: new Date().toISOString(),
    ...event,
  };
  // Structured JSON log — forward to SIEM/log aggregator in production
  console.log(JSON.stringify({ audit: entry }));
}
