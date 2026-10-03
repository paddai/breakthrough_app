import { useState } from "react";

export default function DebtForm() {
    const [name, setName] = useState("");
    const [balance, setBalance] = useState("");
    const [apr, setApr] = useState("");
    const [minPayment, setMinPayment] = useState("");

    const [debts, setDebts] = useState([]);

    const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);

    function handleAddDebt(e) {
        e.preventDefault();
        const balanceNum = parseFloat(balance);
        const aprNum = parseFloat(apr);
        const minPaymentNum = parseFloat(minPayment);
        if (!name || !balanceNum || balanceNum <= 0) return;

        const newDebt = {
            id: crypto.randomUUID(),
            name,
            balance: balanceNum,
            apr: aprNum || 0,
            minPayment: minPaymentNum || 0,
        };

        setDebts([...debts, newDebt]);
        setName("");
        setBalance("");
        setApr("");
        setMinPayment("");
    }

    function handleDelete(id) {
        setDebts(debts.filter((d) => d.id !== id));
    }

    return (
        <div style={{ padding: 24, maxWidth: 640 }}>
            <h1>Debts</h1>
            <p style={{ color: "#999" }}>
                Enter each debt separately — this feeds the payoff strategy comparison later.
            </p>

            <form
                onSubmit={handleAddDebt}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}
            >
                <Field label="Debt name">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Visa credit card"
                    />
                </Field>

                <Field label="Balance">
                    <input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="0.00"
                    />
                </Field>

                <Field label="APR (%)">
                    <input
                        type="number"
                        step="0.1"
                        value={apr}
                        onChange={(e) => setApr(e.target.value)}
                        placeholder="24.0"
                    />
                </Field>

                <Field label="Minimum payment">
                    <input
                        type="number"
                        value={minPayment}
                        onChange={(e) => setMinPayment(e.target.value)}
                        placeholder="0.00"
                    />
                </Field>

                <button type="submit" style={{ gridColumn: "1 / -1" }}>
                    Add debt
                </button>
            </form>

            <div style={{ marginTop: 24, padding: 16, background: "#1e2a24", borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: "#aaa" }}>Total debt</div>
                <div style={{ fontSize: 22, fontWeight: 600 }}>${totalDebt.toFixed(2)}</div>
            </div>

            <div style={{ marginTop: 16 }}>
                {debts.length === 0 && <p style={{ color: "#777" }}>No debts added yet.</p>}
                {debts.map((debt) => (
                    <div
                        key={debt.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 0",
                            borderBottom: "1px solid #333",
                        }}
                    >
                        <div>
                            <div>{debt.name}</div>
                            <div style={{ fontSize: 12, color: "#999" }}>
                                {debt.apr}% APR · ${debt.minPayment.toFixed(2)} min/mo
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div>${debt.balance.toFixed(2)}</div>
                            <button type="button" onClick={() => handleDelete(debt.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <label style={{ display: "block" }}>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 4 }}>{label}</div>
            {children}
        </label>
    );
}
