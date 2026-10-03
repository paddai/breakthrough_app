import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PayCheckForm from "./pages/PayCheckForm";
import ExpenseForm from "./pages/ExpenseForm";
import DebtForm from "./pages/DebtForm";
import DebtComparison from "./pages/DebtComparison";
import RecommendationScreen from "./pages/RecommendationScreen";

export default function App() {
  return (
      <BrowserRouter>
        <nav style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid #ddd" }}>
          <Link to="/">Dashboard</Link>
          <Link to="/paycheck">PayCheck</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/debts">Debts</Link>
          <Link to="/debt-comparison">Debt Comparison</Link>
          <Link to="/recommendation">Recommendation</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/paycheck" element={<PayCheckForm />} />
          <Route path="/expenses" element={<ExpenseForm />} />
          <Route path="/debts" element={<DebtForm />} />
          <Route path="/debt-comparison" element={<DebtComparison />} />
          <Route path="/recommendation" element={<RecommendationScreen />} />
        </Routes>
      </BrowserRouter>
  );
}