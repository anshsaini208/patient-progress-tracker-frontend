import {
    Users,
    FileText,
    Activity,
    TrendingUp,
    ArrowUpRight,
    MoreHorizontal,
} from "lucide-react";

const stats = [
    {
        title: "Total Patients",
        value: "128",
        change: "+12.5%",
        icon: Users,
    },
    {
        title: "Active Reports",
        value: "42",
        change: "+8.2%",
        icon: FileText,
    },
    {
        title: "Health Records",
        value: "286",
        change: "+14.4%",
        icon: Activity,
    },
    {
        title: "Improving",
        value: "76%",
        change: "+5.8%",
        icon: TrendingUp,
    },
];

const patients = [
    {
        name: "Rahul Sharma",
        id: "PT-1024",
        condition: "Diabetes",
        status: "Improving",
        lastVisit: "Today",
    },
    {
        name: "Priya Verma",
        id: "PT-1023",
        condition: "Hypertension",
        status: "Stable",
        lastVisit: "Yesterday",
    },
    {
        name: "Aman Gupta",
        id: "PT-1022",
        condition: "Cardiac",
        status: "Monitoring",
        lastVisit: "2 days ago",
    },
    {
        name: "Neha Singh",
        id: "PT-1021",
        condition: "Thyroid",
        status: "Improving",
        lastVisit: "3 days ago",
    },
];

function Dashboard() {
    return (
        <div className="dashboard">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">OVERVIEW</p>
                    <h1>Patient Dashboard</h1>
                    <p>
                        Monitor patient progress and review health records.
                    </p>
                </div>

                <button className="primary-btn">
                    <Users size={18} />
                    Add Patient
                </button>
            </div>

            <div className="stats-grid">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div className="stat-card" key={stat.title}>
                            <div className="stat-top">
                                <div className="stat-icon">
                                    <Icon size={21} />
                                </div>

                                <button className="icon-btn">
                                    <MoreHorizontal size={19} />
                                </button>
                            </div>

                            <p>{stat.title}</p>
                            <h2>{stat.value}</h2>

                            <div className="stat-change">
                                <ArrowUpRight size={15} />
                                {stat.change}
                                <span>vs last month</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="dashboard-grid">
                <div className="panel patient-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Recent Patients</h2>
                            <p>Latest patient activity</p>
                        </div>

                        <button className="view-btn">View all</button>
                    </div>

                    <div className="patient-table">
                        <div className="table-header">
                            <span>Patient</span>
                            <span>Condition</span>
                            <span>Status</span>
                            <span>Last Visit</span>
                        </div>

                        {patients.map((patient) => (
                            <div className="patient-row" key={patient.id}>
                                <div className="patient-name">
                                    <div className="patient-avatar">
                                        {patient.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>

                                    <div>
                                        <strong>{patient.name}</strong>
                                        <span>{patient.id}</span>
                                    </div>
                                </div>

                                <span>{patient.condition}</span>

                                <span
                                    className={`status ${patient.status === "Improving"
                                            ? "status-green"
                                            : patient.status === "Stable"
                                                ? "status-blue"
                                                : "status-orange"
                                        }`}
                                >
                                    {patient.status}
                                </span>

                                <span>{patient.lastVisit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel activity-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Health Overview</h2>
                            <p>Patient progress</p>
                        </div>
                    </div>

                    <div className="health-circle">
                        <div className="circle-inner">
                            <strong>76%</strong>
                            <span>Improving</span>
                        </div>
                    </div>

                    <div className="health-legend">
                        <div>
                            <span className="legend-dot improving" />
                            Improving
                            <strong>76%</strong>
                        </div>

                        <div>
                            <span className="legend-dot stable" />
                            Stable
                            <strong>18%</strong>
                        </div>

                        <div>
                            <span className="legend-dot monitoring" />
                            Monitoring
                            <strong>6%</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;