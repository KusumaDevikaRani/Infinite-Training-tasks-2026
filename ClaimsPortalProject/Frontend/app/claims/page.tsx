"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import sidebar from "@/app/components/sidebar";
import header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import Header from "@/app/components/header";

interface Claim {
 claimId: number;
 claimNumber: string;
 memberName: string;
 providerName: string;
 claimType: string;
 serviceDate: string;
 billedAmount: number;
 allowedAmount: number | null;
 paidAmount: number | null;
 status: string;
}

export default function ClaimsPage() {
 const [claims, setClaims] = useState<Claim[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 // Search and filters
 const [search, setSearch] = useState("");
 const [statusFilter, setStatusFilter] = useState("All");
 const [typeFilter, setTypeFilter] = useState("All");
 useEffect(() => {
 fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Claims`)
 .then((response) => {
 if (!response.ok) {
 throw new Error("Failed to load claims.");
 }
 return response.json();
 })
 .then((data) => {
 setClaims(data);
 setLoading(false);
 })
 .catch((error) => {
 setError(error.message);
 setLoading(false);
 });
 }, []);
 // Filter claims
 const filteredClaims = claims.filter((claim) => {
 const searchText = search.toLowerCase();
 const matchesSearch =
 claim.claimNumber.toLowerCase().includes(searchText) ||
 claim.memberName.toLowerCase().includes(searchText) ||
 claim.providerName.toLowerCase().includes(searchText);
 const matchesStatus =
 statusFilter === "All" ||
 claim.status === statusFilter;
 const matchesType =
 typeFilter === "All" ||
 claim.claimType === typeFilter;
 return (
 matchesSearch &&
 matchesStatus &&
 matchesType
 );
 });
 const clearFilters = () => {
 setSearch("");
 setStatusFilter("All");
 setTypeFilter("All");
 };
 return (
 <div className="min-h-screen bg-gray-100">
 {/* Header */}
 <Header/>

 <div className="flex">
 {/* Sidebar */}

 <Sidebar/>
 
 {/* Main */}
 <main className="flex-1 p-8">
 {/* Page Heading */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-bold text-gray-800">
 Claims
 </h2>
 <p className="mt-2 text-gray-600">
 View and manage submitted claims.
 </p>
 </div>
 <Link
 href="/claims/new"
 className="bg-blue-600 text-white px-5 py-3 rounded-lg 
hover:bg-blue-700"
 >
 + New Claim
 </Link>
 </div>
 {/* Loading */}
 {loading && (
 <div className="bg-white rounded-lg shadow mt-8 p-6">
 Loading claims...
 </div>
 )}
 {/* Error */}
 {error && (
 <div className="bg-red-100 text-red-700 rounded-lg mt-8 p-6">
 {error}
 </div>
 )}
 {!loading && !error && (
 <>
 {/* Search and Filters */}
 <div className="bg-white rounded-lg shadow mt-8 p-6">
 <h3 className="text-lg font-semibold text-gray-800 mb-4">
 Search & Filter Claims
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 {/* Search */}
 <div className="md:col-span-2">
 <label className="block text-sm font-medium text-gray-700 
mb-2">
 Search
 </label>
 <input
 type="text"
 value={search}
 onChange={(e) =>
 setSearch(e.target.value)
 }
 placeholder="Claim number, member or provider"
 className="w-full border border-gray-300 rounded-lg px-4 
py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
 />
 </div>
 {/* Status */}
 <div>
 <label className="block text-sm font-medium text-gray-700 
mb-2">
 Status
 </label>
 <select
 value={statusFilter}
 onChange={(e) =>
 setStatusFilter(e.target.value)
 }
 className="w-full border border-gray-300 rounded-lg px-4 
py-3"
 >
 <option value="All">
 All
 </option>
 <option value="Pending">
 Pending
 </option>
 <option value="Under Review">
 Under Review
 </option>
 <option value="Approved">
 Approved
 </option>
 <option value="Denied">
 Denied
 </option>
 <option value="Paid">
 Paid
 </option>
 </select>
 </div>
 {/* Claim Type */}
 <div>
 <label className="block text-sm font-medium text-gray-700 
mb-2">
 Claim Type
 </label>
 <select
 value={typeFilter}
 onChange={(e) =>
 setTypeFilter(e.target.value)
 }
 className="w-full border border-gray-300 rounded-lg px-4 
py-3"
 >
 <option value="All">
 All
 </option>
 <option value="Professional">
 Professional
 </option>
 <option value="Institutional">
 Institutional
 </option>
 <option value="Pharmacy">
 Pharmacy
 </option>
 </select>
 </div>
 </div>
 {/* Filter Buttons */}
 <div className="flex items-center gap-3 mt-5">
 <button
 onClick={clearFilters}
 className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg 
hover:bg-gray-300"
 >
 Clear Filters
 </button>
 <span className="text-sm text-gray-500">
 Showing {filteredClaims.length} of{" "}
 {claims.length} claims
 </span>
 </div>
 </div>
 {/* Claims Table */}
 <div className="bg-white rounded-lg shadow mt-6 overflowhidden">
 <div className="p-6 border-b">
 <h3 className="text-xl font-semibold text-gray-800">
 Claim List
 </h3>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-gray-50">
 <tr>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Claim Number
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Member
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Provider
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Type
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Service Date
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Billed
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Status
 </th>
 </tr>
 </thead>
 <tbody>
 {filteredClaims.length > 0 ? (
 filteredClaims.map((claim) => (
 <tr
 key={claim.claimId}
 className="border-t hover:bg-gray-50"
 >
 <td className="px-6 py-4 font-medium">
 <Link
 href={`/claims/${claim.claimId}`}
 className="text-blue-600 hover:underline"
 >
 {claim.claimNumber}
 </Link>
 </td>
 <td className="px-6 py-4">
 {claim.memberName}
 </td>
 <td className="px-6 py-4">
 {claim.providerName}
 </td>
 <td className="px-6 py-4">
 {claim.claimType}
 </td>
 <td className="px-6 py-4">
 {new Date(
 claim.serviceDate
 ).toLocaleDateString()}
 </td>
 <td className="px-6 py-4">
 ${claim.billedAmount.toFixed(2)}
 </td>
 <td className="px-6 py-4">
 <span
 className={`px-3 py-1 rounded-full text-sm ${
 claim.status === "Pending"
 ? "bg-yellow-100 text-yellow-800"
 : claim.status === "Approved"
 ? "bg-green-100 text-green-800"
 : claim.status === "Denied"
 ? "bg-red-100 text-red-800"
 : claim.status === "Paid"
 ? "bg-blue-100 text-blue-800"
 : claim.status === "Under Review"
 ? "bg-purple-100 text-purple-800"
 : "bg-gray-100 text-gray-800"
 }`}
 >
 {claim.status}
 </span>
 </td>
 </tr>
 ))
 ) : (
 <tr>
 <td
 colSpan={7}
 className="px-6 py-8 text-center text-gray-500"
 >
 No claims match your search or filters.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </>
 )}
 </main>
 </div>
 </div>
 )
}