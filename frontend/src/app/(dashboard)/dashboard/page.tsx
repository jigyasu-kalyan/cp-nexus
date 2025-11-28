import { DashboardDataFetcher } from "../../../components/Dashboard/DashboardDataFetcher";

export default function DashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">CP-Nexus Dashboard</h1>
            
            {/* The component that handles client-side data fetching */}
            <DashboardDataFetcher /> 
            
            {/* Placeholder for the ICPC Team Hub link */}
            <div className="mt-10">
                <h2 className="text-xl font-semibold">ICPC Team Hub</h2>
                <p className="text-muted-foreground">
                    Create or join a team to start collaborative training.
                </p>
            </div>
        </div>
    );
}