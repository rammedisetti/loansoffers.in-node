import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import api from '../../api.js';
import ManageShell from '../../components/ManageShell.jsx';
import { formatINR, shortINR, formatDate } from '../../utils/format.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#6B7280'];

const PRESETS = [
  ['last_7', 'Last 7 days'],
  ['last_30', 'Last 30 days'],
  ['last_90', 'Last 90 days'],
  ['this_year', 'This year'],
];

const noLegend = { plugins: { legend: { display: false } }, maintainAspectRatio: false };
const withLegend = { plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false };

export default function Analytics() {
  const [params, setParams] = useSearchParams();
  const preset = params.get('preset') || 'last_30';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    const start = params.get('start');
    const end = params.get('end');
    if (start && end) {
      qs.set('start', start);
      qs.set('end', end);
    } else {
      qs.set('preset', preset);
    }
    api
      .get(`/manage/analytics?${qs.toString()}`)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params]);

  const setPreset = (p) => setParams({ preset: p });

  const charts = useMemo(() => {
    if (!data) return null;
    const labelsValues = (arr) => ({ labels: arr.map((x) => x.label), values: arr.map((x) => x.value) });
    return {
      overTime: {
        labels: data.leads_over_time.map((x) => x.date),
        values: data.leads_over_time.map((x) => x.count),
      },
      byStatus: labelsValues(data.by_status),
      byLoanType: labelsValues(data.by_loan_type),
      bySource: labelsValues(data.by_source),
      byCity: labelsValues(data.by_city),
      amountDist: labelsValues(data.amount_distribution),
      byDow: labelsValues(data.by_day_of_week),
      funnel: labelsValues(data.conversion_funnel),
      avgByType: labelsValues(data.avg_amount_by_type),
      monthly: {
        labels: data.monthly_trend.map((x) => x.month),
        values: data.monthly_trend.map((x) => x.count),
      },
    };
  }, [data]);

  return (
    <ManageShell title="Analytics Dashboard">
      {/* Date filter */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {PRESETS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPreset(key)}
            className={`badge ${preset === key && !params.get('start') ? 'bg-accent text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}
          >
            {label}
          </button>
        ))}
        <DateRange params={params} setParams={setParams} />
        {data && (
          <span className="ml-auto text-sm text-slate-500">
            {data.range.start} → {data.range.end}
          </span>
        )}
      </div>

      {loading || !data ? (
        <p className="py-16 text-center text-slate-500">Loading analytics…</p>
      ) : (
        <>
          {/* KPI cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              ['Total Leads', data.kpi.total_leads],
              ['Approved', data.kpi.approved],
              ['Approval Rate', `${data.kpi.conversion_rate}%`],
              ['Avg Amount', shortINR(data.kpi.avg_amount)],
              ['Total Value', shortINR(data.kpi.total_amount)],
            ].map(([label, value]) => (
              <div key={label} className="card !p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-extrabold text-primary">{value}</p>
              </div>
            ))}
          </div>

          {/* Leads over time */}
          <ChartCard title="Leads Over Time" full>
            <Line
              data={{
                labels: charts.overTime.labels,
                datasets: [
                  {
                    label: 'Leads',
                    data: charts.overTime.values,
                    borderColor: '#2E6BFF',
                    backgroundColor: 'rgba(46,107,255,0.12)',
                    fill: true,
                    tension: 0.35,
                  },
                ],
              }}
              options={noLegend}
            />
          </ChartCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Leads by Status">
              <Doughnut
                data={pieData(charts.byStatus)}
                options={withLegend}
              />
            </ChartCard>
            <ChartCard title="Leads by Loan Type">
              <Bar data={barData(charts.byLoanType, '#2E6BFF')} options={noLegend} />
            </ChartCard>

            <ChartCard title="Leads by Source">
              <Pie data={pieData(charts.bySource)} options={withLegend} />
            </ChartCard>
            <ChartCard title="Top 10 Cities">
              <Bar data={barData(charts.byCity, '#10B981')} options={noLegend} />
            </ChartCard>

            <ChartCard title="Loan Amount Distribution">
              <Bar data={barData(charts.amountDist, '#8B5CF6')} options={noLegend} />
            </ChartCard>
            <ChartCard title="Leads by Day of Week">
              <Bar data={barData(charts.byDow, '#F59E0B')} options={noLegend} />
            </ChartCard>
          </div>

          <ChartCard title="Monthly Trend (12 months)" full>
            <Line
              data={{
                labels: charts.monthly.labels,
                datasets: [
                  {
                    label: 'Leads',
                    data: charts.monthly.values,
                    borderColor: '#18C79C',
                    backgroundColor: 'rgba(24,199,156,0.12)',
                    fill: true,
                    tension: 0.35,
                  },
                ],
              }}
              options={noLegend}
            />
          </ChartCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Avg Loan Amount by Type">
              <Bar
                data={barData(charts.avgByType, '#6366F1')}
                options={{ ...noLegend, scales: { y: { ticks: { callback: (v) => shortINR(v) } } } }}
              />
            </ChartCard>
            <ChartCard title="Conversion Funnel">
              <Bar
                data={barData(charts.funnel, '#EC4899')}
                options={{ ...noLegend, indexAxis: 'y' }}
              />
            </ChartCard>
          </div>

          {/* Tables */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h3 className="mb-3 text-lg font-bold text-primary">Top Sources</h3>
              <table className="min-w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {data.top_sources.map((s) => (
                    <tr key={s.label}>
                      <td className="py-2 text-slate-600">{s.label}</td>
                      <td className="py-2 text-right font-semibold text-primary">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <h3 className="mb-3 text-lg font-bold text-primary">Recent Activity</h3>
              <table className="min-w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {data.recent_activity.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2">
                        <p className="font-medium text-primary">{r.full_name}</p>
                        <p className="text-xs text-slate-400">{r.loan_type_name}</p>
                      </td>
                      <td className="py-2 text-slate-500">{formatINR(r.loan_amount)}</td>
                      <td className="py-2 text-right text-xs text-slate-400">{formatDate(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </ManageShell>
  );
}

function DateRange({ params, setParams }) {
  const [start, setStart] = useState(params.get('start') || '');
  const [end, setEnd] = useState(params.get('end') || '');
  return (
    <div className="flex items-center gap-2">
      <input type="date" className="field-input !py-1.5 !text-sm" value={start} onChange={(e) => setStart(e.target.value)} />
      <span className="text-slate-400">–</span>
      <input type="date" className="field-input !py-1.5 !text-sm" value={end} onChange={(e) => setEnd(e.target.value)} />
      <button
        className="btn-primary !px-4 !py-1.5 text-sm"
        onClick={() => start && end && setParams({ start, end })}
      >
        Apply
      </button>
    </div>
  );
}

function ChartCard({ title, children, full }) {
  return (
    <div className={`card ${full ? 'mb-6' : ''}`}>
      <h3 className="mb-3 text-lg font-bold text-primary">{title}</h3>
      <div className="h-72">{children}</div>
    </div>
  );
}

function pieData({ labels, values }) {
  return {
    labels,
    datasets: [{ data: values, backgroundColor: PALETTE, borderWidth: 0 }],
  };
}

function barData({ labels, values }, color) {
  return {
    labels,
    datasets: [{ data: values, backgroundColor: color, borderRadius: 6 }],
  };
}
