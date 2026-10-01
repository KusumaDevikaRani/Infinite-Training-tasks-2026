"use client";
import { use, useEffect, useState } from "react";

interface ClaimLine {
 claimLineId: number;
 procedureCode: string;
 diagnosisCode: string;
 units: number;
 billedAmount: number;
 allowedAmount: number | null;
 paidAmount: number | null;
}
interface StatusHistory {
 historyId: number;
 oldStatus: string | null;
 newStatus: string;
 comments: string | null;
 changedBy: string;
 changedDate: string;
}
interface Payment {
 paymentId: number;
 paymentAmount: number;
 paymentDate: string | null;
 paymentStatus: string;
 paymentReference: string | null;
}
interface Claim {
 claimId: number;
 claimNumber: string;
 claimType: string;
 serviceDate: string;
 receivedDate: string;
 status: string;
 denialReason: string | null;
 memberNumber: string;
 memberName: string;
 providerName: string;
 npi: string;
 billedAmount: number;
 allowedAmount: number | null;
 paidAmount: number | null;
 memberResponsibility: number | null;
 claimLines: ClaimLine[];
 statusHistory: StatusHistory[];
 payments: Payment[];
}
interface ClaimDetailsPageProps {
 params: Promise<{
 id: string;
 }>;
}
function getStatusClass(status: string) {
 switch (status) {
 case "Pending":
 return "bg-yellow-100 text-yellow-800";
 case "Approved":
 return "bg-green-100 text-green-800";
 case "Denied":
 return "bg-red-100 text-red-800";
 case "Paid":
 return "bg-blue-100 text-blue-800";
 case "Under Review":
 return "bg-purple-100 text-purple-800";
 default:
 return "bg-gray-100 text-gray-800";
 }
}
export default function ClaimDetailsPage({
 params,
}: ClaimDetailsPageProps) {
 const { id } = use(params);
 const [claim, setClaim] = useState<Claim | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 // Status update
 const [newStatus, setNewStatus] = useState("");
 const [comments, setComments] = useState("");
 const [changedBy, setChangedBy] =
 useState("Claims");
 const [savingStatus, setSavingStatus] =
 useState(false);
 const [statusMessage, setStatusMessage] =
 useState("");
 // Load claim
 useEffect(() => {
 fetch(
 `${process.env.NEXT_PUBLIC_API_URL}/api/Claims/${id}`
 )
 .then((response) => {
 if (!response.ok) {
 throw new Error("Failed to load claim.");
 }
 return response.json();
 })
 .then((data) => {
 setClaim(data);
 // Set dropdown to current status
 setNewStatus(data.status);
 setLoading(false);
 })
 .catch((error) => {
 setError(error.message);
 setLoading(false);
 });
 }, [id]);
 // Update status
 const updateStatus = async () => {
 if (!claim) return;
 if (newStatus === claim.status) {
 setStatusMessage(
 "Please select a different status."
 );
 return;
 }
 setSavingStatus(true);
 setStatusMessage("");
 try {
 const response = await fetch(
 
`${process.env.NEXT_PUBLIC_API_URL}/api/Claims/${claim.claimId}/statu
s`,
 {
 method: "PUT",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 newStatus: newStatus,
 comments: comments,
 changedBy: changedBy,
 }),
 }
 );
 if (!response.ok) {
 const message = await response.text();
 throw new Error(
 message || "Failed to update status."
 );
 }
 // Reload claim after updating
 const updatedResponse = await fetch(
 `${process.env.NEXT_PUBLIC_API_URL}/api/Claims/${claim.claimId}`
 );
 if (!updatedResponse.ok) {
 throw new Error(
 "Status updated, but failed to reload claim."
 );
 }
 const updatedClaim =
 await updatedResponse.json();
 setClaim(updatedClaim);
 setNewStatus(updatedClaim.status);
 setComments("");
 setStatusMessage(
 "Claim status updated successfully."
 );
 } catch (error) {
 setStatusMessage(
 error instanceof Error
 ? error.message
 : "Failed to update status."
 );
 } finally {
 setSavingStatus(false);
 }
 };
 // Loading
 if (loading) {
 return (
 <div className="min-h-screen bg-gray-100 p-8">
 Loading claim...
 </div>
 );
 }
 // Error
 if (error) {
 return (
 <div className="min-h-screen bg-gray-100 p-8">
 <div className="bg-red-100 text-red-700 p-6 rounded-lg">
 {error}
 </div>
 </div>
 );
 }
 // No claim
 if (!claim) {
 return (
 <div className="min-h-screen bg-gray-100 p-8">
 Claim not found.
 </div>
 );
 }
 return (
 <div className="min-h-screen bg-gray-100">
 {/* Header */}
 <header className="bg-white border-b">
 <div className="flex items-center justify-between px-8 py-4">
 <h1 className="text-2xl font-bold text-gray-800">
 Claim Portal
 </h1>
 <div className="text-sm text-gray-600">
 Claims 
 </div>
 </div>
 </header>
 {/* Main */}
 <main className="p-8">
 {/* Page Header */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-bold text-gray-800">
 Claim Details
 </h2>
 <p className="mt-2 text-gray-600">
 {claim.claimNumber}
 </p>
 </div>
 <a
 href="/claims"
 className="bg-gray-800 text-white px-5 py-3 rounded-lg hover:bggray-700"
 >
 Back to Claims
 </a>
 </div>
 {/* Claim Information + Member Provider */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
 {/* Claim Information */}
 <div className="bg-white rounded-lg shadow p-6">
 <h3 className="text-xl font-semibold text-gray-800 mb-6">
 Claim Information
 </h3>
 <div className="space-y-4">
 <div>
 <p className="text-sm text-gray-500">
 Claim Number
 </p>
 <p className="font-medium">
 {claim.claimNumber}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Claim Type
 </p>
 <p className="font-medium">
 {claim.claimType}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Service Date
 </p>
 <p className="font-medium">
 {new Date(
 claim.serviceDate
 ).toLocaleDateString()}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Received Date
 </p>
 <p className="font-medium">
 {new Date(
 claim.receivedDate
 ).toLocaleString()}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Current Status
 </p>
 <span
 className={`inline-block mt-1 px-3 py-1 rounded-full text-sm 
${getStatusClass(
 claim.status
 )}`}
 >
 {claim.status}
 </span>
 </div>
 </div>
 </div>
 {/* Member and Provider */}
 <div className="bg-white rounded-lg shadow p-6">
 <h3 className="text-xl font-semibold text-gray-800 mb-6">
 Member & Provider
 </h3>
 <div className="space-y-4">
 <div>
 <p className="text-sm text-gray-500">
 Member
 </p>
 <p className="font-medium">
 {claim.memberName}
 </p>
 <p className="text-sm text-gray-500">
 {claim.memberNumber}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Provider
 </p>
 <p className="font-medium">
 {claim.providerName}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 NPI
 </p>
 <p className="font-medium">
 {claim.npi}
 </p>
 </div>
 </div>
 </div>
 </div>
 {/* Financial Information */}
 <div className="bg-white rounded-lg shadow mt-6 p-6">
 <h3 className="text-xl font-semibold text-gray-800 mb-6">
 Financial Information
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <div>
 <p className="text-sm text-gray-500">
 Billed Amount
 </p>
 <p className="text-2xl font-bold">
 ${claim.billedAmount.toFixed(2)}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Allowed Amount
 </p>
 <p className="text-2xl font-bold">
 {claim.allowedAmount !== null
 ? `$${claim.allowedAmount.toFixed(2)}`
 : "--"}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Paid Amount
 </p>
 <p className="text-2xl font-bold">
 {claim.paidAmount !== null
 ? `$${claim.paidAmount.toFixed(2)}`
 : "--"}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Member Responsibility
 </p>
 <p className="text-2xl font-bold">
 {claim.memberResponsibility !== null
 ? `$${claim.memberResponsibility.toFixed(2)}`
 : "--"}
 </p>
 </div>
 </div>
 </div>
 {/* Status Update */}
 <div className="bg-white rounded-lg shadow mt-6 p-6">
 <h3 className="text-xl font-semibold text-gray-800">
 Update Claim Status
 </h3>
 <p className="text-sm text-gray-500 mt-1">
 Change the current status of this claim.
 </p>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
 {/* Status */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb2">
 Status
 </label>
 <select
 value={newStatus}
 onChange={(e) => {
 setNewStatus(e.target.value);
 setStatusMessage("");
 }}
 className="w-full border border-gray-300 rounded-lg px-4 py-3"
 >
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
 {/* Changed By */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb2">
 Changed By
 </label>
 <input
 type="text"
 value={changedBy}
 onChange={(e) =>
 setChangedBy(e.target.value)
 }
 className="w-full border border-gray-300 rounded-lg px-4 py-3"
 />
 </div>
 {/* Comments */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb2">
 Comments
 </label>
 <input
 type="text"
 value={comments}
 onChange={(e) =>
 setComments(e.target.value)
 }
 placeholder="Optional comment"
 className="w-full border border-gray-300 rounded-lg px-4 py-3"
 />
 </div>
 </div>
 <div className="flex items-center gap-4 mt-5">
 <button
 onClick={updateStatus}
 disabled={
 savingStatus ||
 newStatus === claim.status
 }
 className="bg-blue-600 text-white px-5 py-3 rounded-lg 
hover:bg-blue-700 disabled:opacity-50"
 >
 {savingStatus
 ? "Saving..."
 : "Save Status"}
 </button>
 {statusMessage && (
 <p className="text-sm text-gray-600">
 {statusMessage}
 </p>
 )}
 </div>
 </div>
 {/* Claim Lines */}
 <div className="bg-white rounded-lg shadow mt-6 overflowhidden">
 <div className="p-6 border-b">
 <h3 className="text-xl font-semibold text-gray-800">
 Claim Lines
 </h3>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="bg-gray-50">
 <tr>
 <th className="text-left px-6 py-4">
 Procedure Code
 </th>
 <th className="text-left px-6 py-4">
 Diagnosis Code
 </th>
 <th className="text-left px-6 py-4">
 Units
 </th>
 <th className="text-left px-6 py-4">
 Billed
 </th>
 <th className="text-left px-6 py-4">
 Allowed
 </th>
 <th className="text-left px-6 py-4">
 Paid
 </th>
 </tr>
 </thead>
 <tbody>
 {claim.claimLines.length > 0 ? (
 claim.claimLines.map((line) => (
 <tr
 key={line.claimLineId}
 className="border-t"
 >
 <td className="px-6 py-4">
 {line.procedureCode}
 </td>
 <td className="px-6 py-4">
 {line.diagnosisCode}
 </td>
 <td className="px-6 py-4">
 {line.units}
 </td>
 <td className="px-6 py-4">
 ${line.billedAmount.toFixed(2)}
 </td>
 <td className="px-6 py-4">
 {line.allowedAmount !== null
 ? `$${line.allowedAmount.toFixed(2)}`
 : "--"}
 </td>
 <td className="px-6 py-4">
 {line.paidAmount !== null
 ? `$${line.paidAmount.toFixed(2)}`
 : "--"}
 </td>
 </tr>
 ))
 ) : (
 <tr>
 <td
 colSpan={6}
 className="px-6 py-6 text-center text-gray-500"
 >
 No claim lines available.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 {/* Status History */}
 <div className="bg-white rounded-lg shadow mt-6 p-6">
 <h3 className="text-xl font-semibold text-gray-800 mb-6">
 Status History
 </h3>
 <div className="space-y-4">
 {claim.statusHistory.length > 0 ? (
 claim.statusHistory.map((history) => (
 <div
 key={history.historyId}
 className="border-l-4 border-gray-300 pl-4"
 >
 <p className="font-medium">
 {history.oldStatus ?? "New"} →{" "}
 {history.newStatus}
 </p>
 <p className="text-sm text-gray-500">
 {history.comments ||
 "No comments"}
 </p>
 <p className="text-sm text-gray-400">
 {history.changedBy} •{" "}
 {new Date(
 history.changedDate
 ).toLocaleString()}
 </p>
 </div>
 ))
 ) : (
 <p className="text-gray-500">
 No status history available.
 </p>
 )}
 </div>
 </div>
 {/* Payment */}
 {claim.payments.length > 0 && (
 <div className="bg-white rounded-lg shadow mt-6 p-6">
 <h3 className="text-xl font-semibold text-gray-800 mb-6">
 Payment
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 <div>
 <p className="text-sm text-gray-500">
 Payment Amount
 </p>
 <p className="text-xl font-bold">
 $
 {claim.payments[0].paymentAmount.toFixed(
 2
 )}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Payment Status
 </p>
 <p className="font-medium">
 {claim.payments[0].paymentStatus}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Payment Reference
 </p>
 <p className="font-medium">
 {claim.payments[0].paymentReference ??
 "--"}
 </p>
 </div>
 <div>
 <p className="text-sm text-gray-500">
 Payment Date
 </p>
 <p className="font-medium">
 {claim.payments[0].paymentDate
 ? new Date(
 claim.payments[0].paymentDate
 ).toLocaleDateString()
 : "--"}
 </p>
 </div>
 </div>
 </div>
 )}
 </main>
 </div>
 );
}