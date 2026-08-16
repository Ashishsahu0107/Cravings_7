import React, { useEffect, useState } from "react";
import { 
  MdAttachMoney, MdMoped, MdStar, MdTimer, 
  MdCheckCircle, MdCancel, MdRoute
} from "react-icons/md";
import { getRiderOverview } from "./../../services/riderService";
import { useAuth } from "../../context/AuthContext";
import KPICard from "./common/KPICard";
import LoadingSkeleton from "./common/LoadingSkeleton";
import ErrorState from "./common/ErrorState";

const RiderOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRiderOverview();
      setData(res.data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) return <div className="p-6 h-full"><LoadingSkeleton rows={4} /></div>;
  if (error) return <ErrorState message={error} onRetry={fetchOverview} />;

  // Mock chart data for sparklines
  const mockEarningsData = [
    { value: 120 }, { value: 300 }, { value: 200 }, 
    { value: 450 }, { value: 380 }, { value: data?.todayEarnings || 500 }
  ];
  
  const mockDeliveriesData = [
    { value: 2 }, { value: 5 }, { value: 3 }, 
    { value: 8 }, { value: 6 }, { value: data?.deliveriesToday || 7 }
  ];

  return (
    <div className="overflow-y-auto h-full p-4 sm:p-6 lg:p-8 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-base-300">
      
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-primary/5 p-6 rounded-2xl border border-primary/10">
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-1">
            {getGreeting()}, {user?.fullName?.split(' ')[0] || "Rider"} 👋
          </h1>
          <p className="text-neutral">Here's your performance snapshot for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}.</p>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Today's Earnings" 
          value={`₹${data?.todayEarnings || 0}`}
          icon={<MdAttachMoney className="text-2xl" />}
          trend={12}
          data={mockEarningsData}
        />
        <KPICard 
          title="Deliveries Today" 
          value={data?.deliveriesToday || 0}
          icon={<MdMoped className="text-2xl" />}
          trend={5}
          data={mockDeliveriesData}
        />
        <KPICard 
          title="Active Hours" 
          value={`${data?.activeHours || 0}h`}
          icon={<MdTimer className="text-2xl" />}
        />
        <KPICard 
          title="Tips Earned" 
          value={`₹${data?.tips || 0}`}
          icon={<MdAttachMoney className="text-2xl text-amber-500" />}
        />
      </div>

      {/* Secondary Performance KPIs */}
      <h2 className="text-xl font-bold mt-8 mb-4">Performance Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center text-xl">
            <MdCheckCircle />
          </div>
          <div>
            <p className="text-sm text-neutral">Acceptance Rate</p>
            <p className="text-2xl font-bold">{data?.acceptanceRate || 0}%</p>
          </div>
        </div>
        
        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl">
            <MdRoute />
          </div>
          <div>
            <p className="text-sm text-neutral">Completion Rate</p>
            <p className="text-2xl font-bold">{data?.completionRate || 0}%</p>
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center text-xl">
            <MdCancel />
          </div>
          <div>
            <p className="text-sm text-neutral">Cancellation Rate</p>
            <p className="text-2xl font-bold">{100 - (data?.completionRate || 100)}%</p>
          </div>
        </div>

        <div className="bg-base-100 p-5 rounded-2xl border border-base-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
            <MdStar />
          </div>
          <div>
            <p className="text-sm text-neutral">Customer Rating</p>
            <p className="text-2xl font-bold">{data?.rating || "0.0"} <span className="text-sm font-normal text-neutral">/ 5.0</span></p>
          </div>
        </div>
      </div>
      
      {/* Spacer for mobile bottom nav */}
      <div className="h-4 md:hidden"></div>
    </div>
  );
};

export default RiderOverview;
