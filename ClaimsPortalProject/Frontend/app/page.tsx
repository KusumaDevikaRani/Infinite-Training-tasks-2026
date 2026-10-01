"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
interface DashboardData {
 totalClaims: number;
 pendingClaims: number;
 approvedClaims: number;
 deniedClaims: number;
 paidClaims: number;
 underReviewClaims: number;
 totalBilledAmount: number;
 totalPaidAmount: number;
 totalMembers: number;
 totalProviders: number;
}
export default function DashboardPage() {
 const [data, setData] = useState<DashboardData | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 useEffect(() => {
 fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Dashboard`)
 .then((response) => {
 if (!response.ok) {
 throw new Error("Failed to load dashboard.");
 }
 return response.json();
 })
 .then((result) => {
 setData(result);
 setLoading(false);
 })
 .catch((error) => {
 setError(error.message);
 setLoading(false);
 });
 }, []);
 return (
 <div className="min-h-screen bg-gray-100">
 {/* Header */}
 <Header/>

 <div className="flex">
 {/* Sidebar */}
<Sidebar/>

 {/* Main */}
 <main className="flex-1 p-8">
 <div>
 <h2 className="text-3xl font-bold text-gray-800">
 Dashboard
 </h2>
 <p className="mt-2 text-gray-600">
 Overview of the claims processing system.
 </p>
 </div>
 {/* Loading */}
 {loading && (
 <div className="bg-white rounded-lg shadow mt-8 p-6">
 Loading dashboard...
 </div>
 )}
 {/* Error */}
 {error && (
 <div className="bg-red-100 text-red-700 rounded-lg mt-8 p-6">
 {error}
 </div>
 )}
 {!loading && !error && data && (
 <>
 {/* Claim Statistics */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap6 mt-8">
 {/* Total Claims */}
 <div className="bg-white rounded-lg shadow p-6">
 <p className="text-sm text-gray-500">
 Total Claims
 </p>
 <p className="text-3xl font-bold text-gray-800 mt-2">
 {data.totalClaims}
 </p>
 </div>
 {/* Pending */}
 <div className="bg-white rounded-lg shadow p-6">
 <p className="text-sm text-gray-500">
 Pending Claims
 </p>
 <p className="text-3xl font-bold text-yellow-600 mt-2">
 {data.pendingClaims}
 </p>
 </div>
 {/* Approved */}
 <div className="bg-white rounded-lg shadow p-6">
 <p className="text-sm text-gray-500">
 Approved Claims
 </p>
 <p className="text-3xl font-bold text-green-600 mt-2">
 {data.approvedClaims}
 </p>
 </div>
 {/* Denied */}
 <div className="bg-white rounded-lg shadow p-6">
 <p className="text-sm text-gray-500">
 Denied Claims
 </p>
 <p className="text-3xl font-bold text-red-600 mt-2">
 {data.deniedClaims}
 </p>
 </div>
 </div>
 {/* More Statistics */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap6 mt-6">
 <div className="bg-white rounded-lg shadow p-6">
 <p className="text-sm text-gray-500">
 Paid Claims
 </p>
 <p className="text-3xl font-bold text-blue-600 mt-2">
 {data.paidClaims}
 </p>
 </div>
 <div className="bg-white rounded-lg shadow p-6">
 <p className="text-sm text-gray-500">
 Under Review
 </p>
 <p className="text-3xl font-bold text-purple-600 mt-2">
 {data.underReviewClaims}
 </p>
 </div>
 <div className="bg-white rounded-lg shadow p-6">
 <p className="text-sm text-gray-500">
 Total Members
 </p>
 <p className="text-3xl font-bold text-gray-800 mt-2">
 {data.totalMembers}
 </p>
 </div>
 <div className="bg-white rounded-lg shadow p-6">
 <p className="text-sm text-gray-500">
 Total Providers
 </p>
 <p className="text-3xl font-bold text-gray-800 mt-2">
 {data.totalProviders}
 </p>
 </div>
 </div>
 
 {/* Quick Actions */}
 <div className="bg-white rounded-lg shadow mt-6 p-6">
 <h3 className="text-xl font-semibold text-gray-800">
 Quick Actions
 </h3>
 <div className="flex flex-wrap gap-4 mt-5">
 <Link
 href="/claims/new"
 className="bg-blue-600 text-white px-5 py-3 rounded-lg 
hover:bg-blue-700"
 >
 + New Claim
 </Link>
 <Link
 href="/claims"
 className="bg-gray-800 text-white px-5 py-3 rounded-lg 
hover:bg-gray-700"
 >
 View Claims
 </Link>
 <Link
 href="/members"
 className="bg-gray-200 text-gray-800 px-5 py-3 rounded-lg 
hover:bg-gray-300"
 >
 View Members
 </Link>
 <Link
 href="/providers"
 className="bg-gray-200 text-gray-800 px-5 py-3 rounded-lg 
hover:bg-gray-300"
 >
 View Providers
 </Link>
 </div>
 </div>
 </>
 )}
 </main>
 </div>
 </div>
 );
}