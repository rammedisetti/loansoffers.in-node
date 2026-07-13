import { useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import { formatINR, formatIndianNumber } from '../utils/format.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function computeEmi(principal, annualRate, months) {
  const r = annualRate / 1200;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

export default function EmiCalculator() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(10.5);
  const [months, setMonths] = useState(60);

  const { emi, totalPayable, totalInterest } = useMemo(() => {
    const e = Math.round(computeEmi(amount, rate, months));
    const total = e * months;
    return { emi: e, totalPayable: total, totalInterest: Math.max(total - amount, 0) };
  }, [amount, rate, months]);

  const chartData = {
    labels: ['Principal', 'Total Interest'],
    datasets: [
      {
        data: [amount, totalInterest],
        backgroundColor: ['#2E6BFF', '#18C79C'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <>
      <section className="bg-primary text-white">
        <div className="container-x py-14 text-center">
          <h1 className="text-4xl font-extrabold">EMI Calculator</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Estimate your monthly instalment and plan your loan with confidence.
          </p>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Controls */}
          <div className="card space-y-8">
            <Slider
              label="Loan Amount"
              value={amount}
              min={10000}
              max={50000000}
              step={10000}
              onChange={setAmount}
              display={`₹ ${formatIndianNumber(amount)}`}
            />
            <Slider
              label="Interest Rate (p.a.)"
              value={rate}
              min={0.1}
              max={36}
              step={0.1}
              onChange={setRate}
              display={`${rate.toFixed(2)} %`}
            />
            <Slider
              label="Tenure"
              value={months}
              min={6}
              max={360}
              step={6}
              onChange={setMonths}
              display={`${months} months (${(months / 12).toFixed(1)} yrs)`}
            />
          </div>

          {/* Result */}
          <div className="card">
            <p className="text-sm font-medium text-slate-500">Monthly EMI</p>
            <p className="text-4xl font-extrabold text-primary">{formatINR(emi)}</p>

            <div className="mx-auto mt-6 max-w-[240px]">
              <Doughnut data={chartData} options={{ cutout: '65%', plugins: { legend: { position: 'bottom' } } }} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Stat label="Principal" value={formatINR(amount)} />
              <Stat label="Total Interest" value={formatINR(totalInterest)} />
              <Stat label="Total Payable" value={formatINR(totalPayable)} />
            </div>

            <Link to="/apply" className="btn-primary mt-6 w-full">
              Apply for this Loan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Slider({ label, value, min, max, step, onChange, display }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="field-label mb-0">{label}</label>
        <span className="text-sm font-semibold text-accent">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-accent"
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-lightbg p-3 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-primary">{value}</p>
    </div>
  );
}
