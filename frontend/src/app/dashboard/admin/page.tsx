"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Scale, 
  TrendingUp, 
  DollarSign,
  UserPlus,
  ArrowUpRight,
  MoreVertical,
  Briefcase,
  Inbox,
  AlertTriangle
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bank account states
  const [account, setAccount] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const fetchBankDetails = async () => {
    try {
      const accountsList = await apiFetch('/payment-accounts');
      if (Array.isArray(accountsList) && accountsList.length > 0) {
        // Find the active main account
        const mainAcc = accountsList.find((a: any) => a.isActive) || accountsList[0];
        setAccount(mainAcc);
        setFormValues({
          bankName: mainAcc.bankName || "",
          accountName: mainAcc.accountName || "",
          accountNumber: mainAcc.accountNumber || "",
        });
      }
    } catch (error) {
      console.error("Error fetching bank account details:", error);
    }
  };

  const handleSaveBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        label: "Main Account",
        bankName: formValues.bankName.trim(),
        accountName: formValues.accountName.trim(),
        accountNumber: formValues.accountNumber.trim(),
        currency: "NGN",
        isActive: true,
      };

      if (account?.id) {
        // Update existing account
        const updatedAcc = await apiFetch(`/payment-accounts/${account.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setAccount(updatedAcc);
        alert("Bank account updated successfully!");
      } else {
        // Create new account
        const createdAcc = await apiFetch("/payment-accounts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setAccount(createdAcc);
        alert("Bank account configured successfully!");
      }
    } catch (error: any) {
      alert(error?.message || "Failed to save bank account details");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsData = await apiFetch('/admin/stats');
        const activityData = await apiFetch('/admin/recent-activity');
        setStats(statsData);
        setRecentActivity(activityData);
        await fetchBankDetails();
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (isLoading) return <div className="p-10 animate-pulse space-y-8">
    <div className="h-10 bg-gray-100 rounded-xl w-48" />
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl" />)}
    </div>
    <div className="grid grid-cols-3 gap-8">
       <div className="col-span-2 h-96 bg-gray-100 rounded-[32px]" />
       <div className="h-96 bg-gray-100 rounded-[32px]" />
    </div>
  </div>;

  const statCards = [
    { label: "Total Revenue", value: `₦${stats?.totalRevenue?.toLocaleString() || 0}`, icon: <DollarSign />, color: "bg-green-500", trend: "+12.5%" },
    { label: "Active Lawyers", value: stats?.activeLawyers || 0, icon: <Users />, color: "bg-blue-500", trend: "0%" },
    { label: "Total Cases", value: stats?.totalCases || 0, icon: <Scale />, color: "bg-purple-500", trend: "+5.2%" },
    { label: "Total Clients", value: stats?.totalClients || 0, icon: <Briefcase />, color: "bg-amber-500", trend: "+2.1%" },
    { label: "New Inquiries", value: stats?.newInquiries || 0, icon: <Inbox />, color: "bg-indigo-500", trend: null },
    { label: "Unassigned Cases", value: stats?.unassignedCases || 0, icon: <AlertTriangle />, color: "bg-rose-500", trend: null },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Firm Overview</h1>
          <p className="text-gray-500">Welcome back, Admin. Here's your firm's performance.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/payments" className="bg-white text-primary border border-gray-100 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">
            Financial Reports
          </Link>
          <Link href="/dashboard/lawyers" className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <UserPlus size={20} /> Add Lawyer
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              {stat.trend && (
                <span className="text-green-500 text-[10px] font-bold bg-green-50 px-2 py-1 rounded-lg">
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-primary mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-primary">Recent Cases</h3>
            <Link href="/dashboard/cases" className="text-secondary font-bold text-sm">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Case Title</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Counsel</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentActivity.map((item, i) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-6">
                       <span className="font-bold text-primary">{item.title}</span>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-600">{item.client.name}</td>
                    <td className="px-8 py-6 text-sm text-primary font-bold">{(item as any).litigationTeam || item.lawyer?.name || 'TEAM ANCHOR'}</td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        item.status === 'OPEN' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link href={`/dashboard/cases/${item.id}`} className="text-gray-400 hover:text-primary transition-colors">
                        <ArrowUpRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentActivity.length === 0 && (
                   <tr>
                     <td colSpan={5} className="px-8 py-10 text-center text-gray-400 italic">No recent cases.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Stream Visual */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-primary mb-8">Revenue Stream</h3>
          <div className="flex-1 flex flex-col justify-end gap-2">
            {[40, 70, 45, 90, 65, 80].map((h, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 text-xs text-gray-400">MAY {i+1}</div>
                <div className="flex-1 bg-gray-50 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${h}%` }}
                    className="bg-secondary h-full rounded-full" 
                  />
                </div>
                <div className="text-xs font-bold text-primary">₦{h*10}k</div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Total Monthly</p>
              <p className="text-xl font-bold text-primary">₦{stats?.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-green-50 text-green-600 p-2 rounded-lg">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Firm Bank Account Settings */}
      <section className="bg-white rounded-[32px] border border-gray-100 p-8 sm:p-10 shadow-sm max-w-2xl">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary">Firm Bank Account Settings</h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure the bank details that clients will see when they select the "Bank Transfer" payment option.
          </p>
        </div>

        <form onSubmit={handleSaveBankAccount} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={formValues.bankName}
                onChange={(e) => setFormValues({ ...formValues, bankName: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
                placeholder="e.g. Money Point"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Account Name
              </label>
              <input
                type="text"
                value={formValues.accountName}
                onChange={(e) => setFormValues({ ...formValues, accountName: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
                placeholder="e.g. Midlex"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={formValues.accountNumber}
              onChange={(e) => setFormValues({ ...formValues, accountNumber: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-primary font-medium font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
              placeholder="e.g. 0123456789"
              pattern="\d+"
              title="Please enter numbers only"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all disabled:opacity-50"
            >
              {isSaving ? "Saving details..." : "Save Account Details"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
