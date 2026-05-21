import { prisma } from './db';

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

/**
 * Record a security-relevant event.
 *
 * Fire-and-forget by design: auditing must never block, slow down or fail the
 * request that triggered it. The event is both written to stdout as structured
 * JSON (for SIEM/log-aggregator forwarding) and persisted to the AuditLog
 * table so it is durable and queryable — a NEN 7510 / ISO 27001 requirement
 * that a stdout-only log on ephemeral serverless infrastructure cannot meet.
 */
export function auditLog(event: AuditEvent): void {
  const entry = {
    timestamp: new Date().toISOString(),
    ...event,
  };
  // Structured JSON log — forwarded to SIEM/log aggregator in production.
  console.log(JSON.stringify({ audit: entry }));

  // Durable copy in the database. The promise is intentionally not awaited;
  // a logging failure is swallowed so it can never surface to the caller.
  prisma.auditLog
    .create({
      data: {
        type: event.type,
        orgId: event.orgId ?? null,
        userId: event.userId ?? null,
        email: event.email ?? null,
        ipAddress: event.ipAddress ?? null,
        userAgent: event.userAgent ?? null,
        details: event.details ? JSON.stringify(event.details) : null,
      },
    })
    .catch(() => {
      /* logging must not break the request */
    });
}
