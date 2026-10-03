import { useState } from "react";

// A "controlled input" in React means the input's value always comes
// from state, and every keystroke updates that state via onChange.
// That's why every field below has both a value={...} and an onChange.
export default function PaycheckForm() {
    const [payType, setPayType] = useState("hourly"); // "hourly" | "salary"

    // Hourly fields
    const [hourlyRate, setHourlyRate] = useState("");
    const [regularHours, setRegularHours] = useState("");
    const [overtimeHours, setOvertimeHours] = useState("");
    const [overtimeMultiplier, setOvertimeMultiplier] = useState("1.5");

    // Salary field (pay-period amount for now — annual-to-period
    // conversion is task 4.2, pay frequency, which isn't built yet)
    const [salaryAmount, setSalaryAmount] = useState("");

    // Inputs are always strings in React, even for type="number" fields.
    // parseFloat converts to a real number; "|| 0" catches empty/invalid
    // input so the math below never produces NaN on screen.
    const rate = parseFloat(hourlyRate) || 0;
    const regHours = parseFloat(regularHours) || 0;
    const otHours = parseFloat(overtimeHours) || 0;
    const otMultiplier = parseFloat(overtimeMultiplier) || 0;
    const salary = parseFloat(salaryAmount) || 0;

    const regularPay = rate * regHours;
    const overtimePay = rate * otHours * otMultiplier;
    const estimatedGrossPay =
        payType === "hourly" ? regularPay + overtimePay : salary;

    function handleReset() {
        setHourlyRate("");
        setRegularHours("");
        setOvertimeHours("");
        setOvertimeMultiplier("1.5");
        setSalaryAmount("");
    }

    return (
        <div style={{ padding: 24, maxWidth: 560 }}>
            <h1>Gross Pay</h1>
            <p style={{ color: "#999" }}>
                Estimate gross pay before taxes, benefits, and other deductions.
            </p>

            {/* Hourly / Salary toggle */}
            <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
                <button
                    type="button"
                    onClick={() => setPayType("hourly")}
                    style={toggleButtonStyle(payType === "hourly")}
                >
                    Hourly
                </button>
                <button
                    type="button"
                    onClick={() => setPayType("salary")}
                    style={toggleButtonStyle(payType === "salary")}
                >
                    Salary
                </button>
            </div>

            {payType === "hourly" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label="Hourly rate">
                        <input
                            type="number"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                            placeholder="0.00"
                        />
                    </Field>
                    <Field label="Regular hours">
                        <input
                            type="number"
                            value={regularHours}
                            onChange={(e) => setRegularHours(e.target.value)}
                            placeholder="0"
                        />
                    </Field>
                    <Field label="Overtime hours">
                        <input
                            type="number"
                            value={overtimeHours}
                            onChange={(e) => setOvertimeHours(e.target.value)}
                            placeholder="0"
                        />
                    </Field>
                    <Field label="Overtime multiplier">
                        <input
                            type="number"
                            step="0.1"
                            value={overtimeMultiplier}
                            onChange={(e) => setOvertimeMultiplier(e.target.value)}
                        />
                    </Field>
                </div>
            ) : (
                <Field label="Salary (this pay period)">
                    <input
                        type="number"
                        value={salaryAmount}
                        onChange={(e) => setSalaryAmount(e.target.value)}
                        placeholder="0.00"
                    />
                </Field>
            )}

            {/* Live results — recalculates on every keystroke since it reads
          the same state the inputs above write to. No submit button
          needed for this part. */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: payType === "hourly" ? "1fr 1fr 1fr" : "1fr",
                    gap: 16,
                    marginTop: 24,
                    padding: 16,
                    background: "#1e2a24",
                    borderRadius: 8,
                }}
            >
                {payType === "hourly" && (
                    <>
                        <Result label="Regular pay" value={regularPay} />
                        <Result label="Overtime pay" value={overtimePay} />
                    </>
                )}
                <Result label="Estimated gross pay" value={estimatedGrossPay} emphasize />
            </div>

            <button type="button" onClick={handleReset} style={{ marginTop: 16 }}>
                Reset
            </button>
        </div>
    );
}

// Small reusable pieces so the form markup above stays readable.
function Field({ label, children }) {
    return (
        <label style={{ display: "block" }}>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 4 }}>{label}</div>
            {children}
        </label>
    );
}

function Result({ label, value, emphasize }) {
    return (
        <div>
            <div style={{ fontSize: 12, color: "#aaa" }}>{label}</div>
            <div style={{ fontSize: emphasize ? 22 : 18, fontWeight: 600 }}>
                ${value.toFixed(2)}
            </div>
        </div>
    );
}

function toggleButtonStyle(active) {
    return {
        padding: "8px 16px",
        borderRadius: 6,
        border: "1px solid #444",
        background: active ? "#2d6a4f" : "transparent",
        color: "#fff",
        cursor: "pointer",
    };
}
