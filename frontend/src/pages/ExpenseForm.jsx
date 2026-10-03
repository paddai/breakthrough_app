import { useState } from "react";

const CATEGORIES = [
    "Housing",
    "Groceries",
    "Dining",
    "Transportation",
    "Utilities",
    "Shopping",
    "Other",
];

export default function ExpenseForm() {
    // Form fields — same controlled-input pattern as PaycheckForm.
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    // NEW: a list lives in state too. Each entry is a plain object.
    // Arrays and objects in React state are never mutated directly
    // (no .push()) — you always create a new array/object and call
    // the setter, which is why handleAddExpense below uses [...expenses, newExpense]
    // instead of expenses.push(newExpense).
    const [expenses, setExpenses] = useState([]);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    function handleAddExpense(e) {
        e.preventDefault(); // stop the form from reloading the page
        const amountNum = parseFloat(amount);
        if (!description || !amountNum || amountNum <= 0) return; // basic guard

        const newExpense = {
            id: crypto.randomUUID(), // generates a unique id per entry
            description,
            category,
            amount: amountNum,
            date: date || new Date().toISOString().slice(0, 10),
        };

        setExpenses([...expenses, newExpense]); // new array, not a mutation
        setDescription("");
        setAmount("");
        setDate("");
    }

    function handleDelete(id) {
        // Keep every expense whose id does NOT match the one clicked.
        setExpenses(expenses.filter((e) => e.id !== id));
    }

    return (
        <div style={{ padding: 24, maxWidth: 640 }}>
            <h1>Expenses</h1>
            <p style={{ color: "#999" }}>Log what you spend and where it's going.</p>

            <form
                onSubmit={handleAddExpense}
                style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginTop: 16 }}
            >
                <Field label="Description">
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Whole Foods"
                    />
                </Field>

                <Field label="Category">
                    {/* A <select> is still a controlled input: value + onChange,
              same as a text input. */}
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Amount">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                    />
                </Field>

                <Field label="Date">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>

                <button type="submit" style={{ gridColumn: "1 / -1" }}>
                    Add expense
                </button>
            </form>

            <div style={{ marginTop: 24, padding: 16, background: "#1e2a24", borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: "#aaa" }}>Total this list</div>
                <div style={{ fontSize: 22, fontWeight: 600 }}>${total.toFixed(2)}</div>
            </div>

            {/* .map() turns each item in the array into a piece of UI.
          React needs a unique "key" prop on each item so it can tell
          them apart when the list changes — that's what expense.id is for. */}
            <div style={{ marginTop: 16 }}>
                {expenses.length === 0 && (
                    <p style={{ color: "#777" }}>No expenses logged yet.</p>
                )}
                {expenses.map((expense) => (
                    <div
                        key={expense.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 0",
                            borderBottom: "1px solid #333",
                        }}
                    >
                        <div>
                            <div>{expense.description}</div>
                            <div style={{ fontSize: 12, color: "#999" }}>
                                {expense.category} · {expense.date}
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div>${expense.amount.toFixed(2)}</div>
                            <button type="button" onClick={() => handleDelete(expense.id)}>
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
