<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { PROBLEM_LABEL, problemsFor } from '#lib/kb/problems.ts';
  import { tenantOf } from '#lib/kb/locales';
  import type { Report } from '#lib/kb/causes';

  let { ticket }: { ticket: number } = $props();

  const rows = $derived(problemsFor(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const total = $derived(rows.reduce((n, row) => n + row.reports.length, 0));
</script>

<p class="sum">
  <strong>{total}</strong> reports in #{ticket} ·
  <strong>{rows.length}</strong>
  {rows.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each rows as row (row.id)}
      <tr>
        <td><code>{row.id}</code> {PROBLEM_LABEL[row.id]}</td>
        <td>{row.reports.length}</td>
        <td>{row.tenants}</td>
        <td>{row.firstSeen} → {row.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
</style>
