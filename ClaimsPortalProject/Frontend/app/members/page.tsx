"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import Sidebar from "../components/sidebar";
import Header from "../components/header";


interface Member {
 memberId: number;
 memberNumber: string;
 firstName: string;
 lastName: string;
 dateOfBirth: string;
 gender: string | null;
 planName: string;
 coverageStartDate: string;
 coverageEndDate: string;
 status: string;
}
export default function MembersPage() {
 const [members, setMembers] = useState<Member[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 useEffect(() => {
 fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Members`)
 .then((response) => {
 if (!response.ok) {
 throw new Error("Failed to load members.");
 }
 return response.json();
 })
 .then((data) => {
 setMembers(data);
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

 {/* Main Content */}
 <main className="flex-1 p-8">
 <div>
 <h2 className="text-3xl font-bold text-gray-800">
 Members
 </h2>
 <p className="mt-2 text-gray-600">
 View member information and coverage details.
 </p>

 </div>
    {/* <Link
 href="/members/new"
 className="bg-blue-600 text-white px-5 py-3 rounded-lg 
hover:bg-blue-700"
 >
 + New Member
 </Link> */}

 {/* Loading */}
 {loading && (
 <div className="bg-white rounded-lg shadow mt-8 p-6">
 Loading members...
 </div>
 )}
 {/* Error */}
 {error && (
 <div className="bg-red-100 text-red-700 rounded-lg mt-8 p-6">
 {error}
 </div>
 )}

 
 {/* Members Table */}
 {!loading && !error && (
 <div className="bg-white rounded-lg shadow mt-8 overflowhidden">
 <div className="p-6 border-b">
 <h3 className="text-xl font-semibold text-gray-800">
 Member List
 </h3>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-gray-50">
 <tr>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Member Number
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Name
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Date of Birth
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Gender
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Plan
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Coverage
 </th>
 <th className="text-left px-6 py-4 text-sm font-semibold 
text-gray-600">
 Status
 </th>
 </tr>
 </thead>
 <tbody>
 {members.length > 0 ? (
 members.map((member) => (
 <tr
 key={member.memberId}
 className="border-t hover:bg-gray-50"
 >
 <td className="px-6 py-4 font-medium text-blue-600">
 {member.memberNumber}
 </td>
 <td className="px-6 py-4">
 {member.firstName} {member.lastName}
 </td>
 <td className="px-6 py-4">
 {new Date(
 member.dateOfBirth
 ).toLocaleDateString()}
 </td>
 <td className="px-6 py-4">
 {member.gender || "--"}
 </td>
 <td className="px-6 py-4">
 {member.planName}
 </td>
 <td className="px-6 py-4 text-sm">
 {new Date(
 member.coverageStartDate
 ).toLocaleDateString()}
 {" - "}
 {new Date(
 member.coverageEndDate
 ).toLocaleDateString()}
 </td>
 <td className="px-6 py-4">
 <span
 className={`px-3 py-1 rounded-full text-sm ${
 member.status === "Active"
 ? "bg-green-100 text-green-800"
 : "bg-gray-100 text-gray-800"
 }`}
 >
 {member.status}
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
 No members found.
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