import { useState } from "react";

// PLACEHOLDER DATA — once DebtForm saves to the backend (task 6.3), this
// should come from an API call instead, e.g. fetched in a useEffect here.
// Numbers below are realistic sample debts for testing the simulation.
const SAMPLE_DEBTS = [
    { name: "Store card", balance: 600, apr: 26, minPayment: 25 },
    { name: "Credit card", balance: 4200, apr: 24, minPayment: 90 },
    { name: "Car loan", balance: 9800, apr: 7, minPayment: 220 },
];

// Simulates paying off a set of debts one month at a time.
// Every debt gets its minimum payment; any "extra" budget goes entirely
// toward whichever debt is first in `order` and still has a balance.
// This is the actual snowball/avalanche mechanic — the only difference
// between the two strategies is how `order` was sorted before calling this.
function simulatePayoff(debts, extraPerMonth, order) {
    // Work on copies so we never mutate the original debts passed in.
    const active = order.map((name) => {
        const d = debts.find((x) => x.name === name);
        return { ...d };
    });

    let months = 0;
    let totalInterest = 0;
    const maxMonths = 600; // 50-year safety cap so a bad input can't infinite-loop

    while (active.some((d) => d.balance > 0) && months < maxMonths) {
        months++;
        let extra = extraPerMonth;

        for (const debt of active) {
            if (debt.balance <= 0) continue;

            // Interest accrues on the remaining balance each month.
            const monthlyInterest = debt.balance * (debt.apr / 100 / 12);
            totalInterest += monthlyInterest;
            debt.balance += monthlyInterest;

            // The first still-active debt in priority order gets the extra
            // payment on top of its minimum; every other debt gets only its
            // minimum. Once this debt is paid off, next month the loop finds
            // the next debt in `order` as the new "first active" one.
            let payment = debt.minPayment;
            if (extra > 0 && active.find((d) => d.balance > 0) === debt) {
                payment += extra;
                extra = 0;
            }

            payment = Math.min(payment, debt.balance); // never pay more than owed
            debt.balance -= payment;
        }
    }

    return { months, totalInterest };
}

export default function DebtComparison() {
    const [extraPerMonth, setExtraPerMonth] = useState("100");
    const extra = parseFloat(extraPerMonth) || 0;

    const avalancheOrder = [...SAMPLE_DEBTS]
        .sort((a, b) => b.apr - a.apr) // highest interest rate first
        .map((d) => d.name);

    const snowballOrder = [...SAMPLE_DEBTS]
        .sort((a, b) => a.balance - b.balance) // smallest balance first
        .map((d) => d.name);

    const avalancheResult = simulatePayoff(SAMPLE_DEBTS, extra, avalancheOrder);
    const snowballResult = simulatePayoff(SAMPLE_DEBTS, extra, snowballOrder);

    const interestSaved = snowballResult.totalInterest - avalancheResult.totalInterest;

    return (
        <div style={{ padding: 24, maxWidth: 680 }}>
            <h1>Debt Comparison</h1>
            <p style={{ color: "#999" }}>
                Comparing payoff order strategies using sample debts (not yet connected
                to the Debts form).
            </p>

            <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", fontSize: 13, color: "#aaa", marginBottom: 4 }}>
                    Extra payment toward debt each month
                </label>
                <input
                    type="number"
                    value={extraPerMonth}
                    onChange={(e) => setExtraPerMonth(e.target.value)}
                    style={{ width: 160 }}
                />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
                <StrategyCard
                    title="Avalanche"
                    subtitle="Highest APR first"
                    order={avalancheOrder}
                    result={avalancheResult}
                    best={avalancheResult.totalInterest <= snowballResult.totalInterest}
                />
                <StrategyCard
                    title="Snowball"
                    subtitle="Smallest balance first"
                    order={snowballOrder}
                    result={snowballResult}
                    best={snowballResult.totalInterest < avalancheResult.totalInterest}
                />
            </div>

            {interestSaved > 0.01 && (
                <p style={{ marginTop: 16, color: "#9fd6a8" }}>
                    Avalanche saves an estimated ${interestSaved.toFixed(2)} in total
                    interest compared to snowball, at this payment level.
                </p>
            )}
        </div>
    );
}

function StrategyCard({ title, subtitle, order, result, best }) {
    return (
        <div
            style={{
                padding: 16,
                borderRadius: 8,
                background: "#1e2a24",
                border: best ? "1px solid #2d6a4f" : "1px solid #333",
            }}
        >
            <h3 style={{ margin: 0 }}>{title}</h3>
            <div style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>{subtitle}</div>

            <ol style={{ paddingLeft: 20, margin: "0 0 12px" }}>
                {order.map((name) => (
                    <li key={name}>{name}</li>
                ))}
            </ol>

            <div style={{ fontSize: 13, color: "#aaa" }}>Payoff time</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
                {Math.floor(result.months / 12)}y {result.months % 12}mo
            </div>

            <div style={{ fontSize: 13, color: "#aaa", marginTop: 8 }}>Total interest paid</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
                ${result.totalInterest.toFixed(2)}
            </div>
        </div>
    );
}
