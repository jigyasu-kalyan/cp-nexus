import { DashboardDataFetcher } from "../../../components/Dashboard/DashboardDataFetcher";

export default function DashboardPage() {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600">CP-Nexus Dashboard</h1>

            {/* The component that handles client-side data fetching */}
            <DashboardDataFetcher />

            {/* Placeholder for the ICPC Team Hub link */}
            <div className="mt-10 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur">
                <h2 className="text-xl font-bold text-slate-100 mb-2">ICPC Team Hub</h2>
                <p className="text-slate-400">
                    Create or join a team to start collaborative training.
                </p>
            </div>
        </div>
    );
}