// The problems inside one merged ticket. Pages name them; this file counts them.
import { causeOf, uniqueById, type Report, type Tenant } from './causes.ts';

export type ProblemId = 'parser' | 'hint' | 'one-day' | 'unplaced';

export const PROBLEM_LABEL: Record<ProblemId, string> = {
  parser: 'day-first dates read month-first',
  hint: 'form hint says month-first, read day-first',
  'one-day': 'moves by one day',
  unplaced: 'no tenant cause',
};

export type ProblemRow = {
  id: ProblemId;
  reports: Report[];
  tenants: number;
  firstSeen: string;
  lastSeen: string;
};

const ORDER: readonly ProblemId[] = ['parser', 'hint', 'one-day', 'unplaced'];

export function problemsFor(
  reports: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayIds: readonly string[],
): ProblemRow[] {
  const oneDay = new Set(oneDayIds);
  const by = new Map<ProblemId, Report[]>();
  for (const r of uniqueById(reports).filter((r) => r.mergedInto === ticket)) {
    const id: ProblemId = oneDay.has(r.id) ? 'one-day' : (causeOf(r, tenantOf(r)) ?? 'unplaced');
    by.set(id, [...(by.get(id) ?? []), r]);
  }
  return ORDER.flatMap((id) => {
    const rs = by.get(id);
    if (!rs?.length) return [];
    const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
    return [{
      id,
      reports: rs,
      tenants: new Set(rs.map((r) => r.tenant)).size,
      firstSeen: days[0],
      lastSeen: days[days.length - 1],
    }];
  });
}
