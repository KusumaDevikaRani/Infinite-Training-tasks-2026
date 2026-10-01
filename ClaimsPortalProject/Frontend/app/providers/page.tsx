"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
interface Provider {
 providerId: number;
 npi: string;
 providerName: string;
 specialty: string | null;
 address: string | null;
 status: string;
}
export default function ProvidersPage() {
 const [providers, setProviders] = useState<Provider[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 useEffect(() => {
 fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Providers`)
 .then((response) => {
 if (!response.ok) {
 throw new Error("Failed to load providers.");
 }
 return response.json();
 })
 .then((data) => {
 setProviders(data);
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
 Providers
 </h2>
 <p className="mt-2 text-gray-600">
 View healthcare provider information.
 </p>
 {/* <Link
 href="/providers/en"
 className="bg-blue-600 text-white px-5 py-3 rounded-lg 
hover:bg-blue-700"
 >
 + New Provider
 </Link> */}
 </div>
 {/* Loading */}
 {loading && (
 <div className="bg-white rounded-lg shadow mt-8 p-6">
 Loading providers...
 </div>
 )}
 {/* Error */}
 {error && (
 <div className="bg-red-100 text-red-700 rounded-lg mt-8 p-6">
 {error}
 </div>
 )}
 {/* Table */}
 {!loading && !error && (
 <div className="bg-white rounded-lg shadow mt-8 overflowhidden">
 <div className="p-6 border-b">
 <h3 className="text-xl font-semibold text-gray-800">
 Provider List
 </h3>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-gray-50">
 <tr>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 NPI
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Provider Name
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Specialty
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Address
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Status
 </th>
 </tr>
 </thead>
 <tbody>
 {providers.length > 0 ? (
 providers.map((provider) => (
 <tr
 key={provider.providerId}
 className="border-t hover:bg-gray-50"
 >
 <td className="px-6 py-4 font-medium text-blue-600">
 {provider.npi}
 </td>
 <td className="px-6 py-4">
 {provider.providerName}
 </td>
 <td className="px-6 py-4">
 {provider.specialty || "--"}
 </td>
 <td className="px-6 py-4">
 {provider.address || "--"}
 </td>
 <td className="px-6 py-4">
 <span
 className={`px-3 py-1 rounded-full text-sm ${
 provider.status === "Active"
 ? "bg-green-100 text-green-800"
 : "bg-gray-100 text-gray-800"
 }`}
 >
 {provider.status}
 </span>
 </td>
 </tr>
 ))
 ) : (
 <tr>
 <td
 colSpan={5}
 className="px-6 py-8 text-center text-gray-500"
 >
 No providers found.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}
 </main>
 </div>
 </div>
 );
}