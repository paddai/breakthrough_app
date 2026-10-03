import { useState } from "react";

// PLACEHOLDER DATA — once the Paycheck and Debts forms save to the
// backend, these four values should be fetched from there instead of
// hardcoded here. Everything else on this page is real working logic.
const SAMPLE_GROSS_PAY_PER_PAYCHECK = 2150; // biweekly
const SAMPLE_401K_PERCENT = 9; // what the user currently contributes
const SAMPLE_EMPLOYER_MATCH_PERCENT = 6; // employer matches up to this %
const SAMPLE_HIGHEST_APR_DEBT = { name: "Credit card", apr: 24, balance: 4200 };

export default function RecommendationScreen() {
    const [selectedOption, setSelectedOption] = useState(null);

    // Task 7.1: compare current 401(k) contribution with the employer match
    const contributionAboveMatch = Math.max(
        0,
        SAMPLE_401K_PERCENT - SAMPLE_EMPLOYER_MATCH_PERCENT
    );

    // Task 7.3: dollar amount above the match, per paycheck
    const amountAboveMatchPerPaycheck =
        SAMPLE_GROSS_PAY_PER_PAYCHECK * (contributionAboveMatch / 100);

    // Task 7.2: is there high-interest debt to flag against it?
    // 7% is used here as a simple "better than a typical market return"
    // threshold — the same reasoning used in the design document's
    // priority waterfall (see Capstone_Design_Document.docx).
    const hasHighInterestDebt = SAMPLE_HIGHEST_APR_DEBT.apr > 7;

    // Task 7.5: rough current-vs-alternative comparison. This is a
    // simplified estimate (one year, simple interest), not a full
    // amortization simulation like DebtComparison.jsx — enough to make
    // the recommendation concrete without re-deriving the whole payoff.
    const annualAmountIfRedirected = amountAboveMatchPerPaycheck * 26; // 26 biweekly paychecks/year
    const estimatedInterestSaved =
        annualAmountIfRedirected * (SAMPLE_HIGHEST_APR_DEBT.apr / 100);

    const showRecommendation = contributionAboveMatch > 0 && hasHighInterestDebt;

    const options = [
        {
            id: "reduce-401k",
            label: `Lower 401(k) to ${SAMPLE_EMPLOYER_MATCH_PERCENT}% (match only)`,
            detail: `Redirect the difference to your ${SAMPLE_HIGHEST_APR_DEBT.name}. Fastest payoff, minimal change to retirement timeline.`,
        },
        {
            id: "keep-401k",
            label: "Keep 401(k) contribution the same",
            detail: "Find the extra payment amount elsewhere in your budget instead.",
        },
        {
            id: "keep-as-is",
            label: "Keep everything as is",
            detail: "You may have a reason — a vesting cliff, an upcoming raise, etc.",
        },
    ];

    return (
        <div style={{ padding: 24, maxWidth: 640 }}>
            <h1>Recommendation</h1>
            <p style={{ color: "#999" }}>
                Comparing your 401(k) contribution against your employer's match and
                your highest-interest debt (sample data, not yet connected to the
                Paycheck and Debts forms).
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
                <Stat label="Your 401(k) contribution" value={`${SAMPLE_401K_PERCENT}%`} />
                <Stat label="Employer match, up to" value={`${SAMPLE_EMPLOYER_MATCH_PERCENT}%`} />
                <Stat
                    label="Highest-APR debt"
                    value={`${SAMPLE_HIGHEST_APR_DEBT.name} · ${SAMPLE_HIGHEST_APR_DEBT.apr}%`}
                />
                <Stat
                    label="Contributing above match"
                    value={`${contributionAboveMatch}% ($${amountAboveMatchPerPaycheck.toFixed(2)}/paycheck)`}
                />
            </div>

            {showRecommendation ? (
                <div
                    style={{
                        marginTop: 24,
                        padding: 16,
                        borderRadius: 8,
                        background: "#1e2a24",
                        border: "1px solid #a24328",
                    }}
                >
                    <p style={{ margin: 0 }}>
                        You're contributing <strong>{contributionAboveMatch}% above</strong>{" "}
                        your employer's match, while carrying a{" "}
                        <strong>{SAMPLE_HIGHEST_APR_DEBT.apr}% APR</strong> balance on your{" "}
                        {SAMPLE_HIGHEST_APR_DEBT.name}. Redirecting that amount could save
                        roughly <strong>${estimatedInterestSaved.toFixed(2)}</strong> in
                        interest over the next year.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                        {options.map((opt) => (
                            <label
                                key={opt.id}
                                onClick={() => setSelectedOption(opt.id)}
                                style={{
                                    display: "block",
                                    padding: 12,
                                    borderRadius: 6,
                                    border:
                                        selectedOption === opt.id ? "1px solid #2d6a4f" : "1px solid #444",
                                    background: selectedOption === opt.id ? "#24352c" : "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                <div style={{ fontWeight: 600 }}>{opt.label}</div>
                                <div style={{ fontSize: 13, color: "#999" }}>{opt.detail}</div>
                            </label>
                        ))}
                    </div>
                </div>
            ) : (
                <p style={{ marginTop: 24, color: "#9fd6a8" }}>
                    No mismatch found — your contribution isn't exceeding the match
                    while carrying high-interest debt.
                </p>
            )}
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div>
            <div style={{ fontSize: 12, color: "#aaa" }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{value}</div>
        </div>
    );
}
