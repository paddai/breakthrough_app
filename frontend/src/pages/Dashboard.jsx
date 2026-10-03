import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

    const [apiStatus, setApiStatus] = useState("Checking backend...");

    useEffect(() => {

        axios.get("http://localhost:8080/api/health")
            .then((response) => {
                setApiStatus(response.data);
            })
            .catch((error) => {
                console.error("Backend connection failed:", error);
                setApiStatus("Backend connection failed");
            });

    }, []);

    return (
        <div>
            <h1>Breathing Room</h1>

            <h2>Financial Dashboard</h2>

            <p>
                From paycheck pressure to financial clarity.
            </p>

            <p>
                Your financial summary will appear here.
            </p>

            <hr />

            <p>
                <strong>Backend Status:</strong> {apiStatus}
            </p>
        </div>
    );
}

export default Dashboard;