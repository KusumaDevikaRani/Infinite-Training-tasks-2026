"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface Member {
 memberId: number;
 memberNumber: string;
 firstName: string;
 lastName: string;
}
interface Provider {
 providerId: number;
 npi: string;
 providerName: string;
}
interface ClaimLine {
  procedureCode: string;
  diagnosisCode: string;
  units: number;
  billedAmount: number;
}

export default function NewClaimPage() {
 const router = useRouter();
 const [members, setMembers] = useState<Member[]>([]);
 const [providers, setProviders] = useState<Provider[]>([]);
 const [claimNumber, setClaimNumber] = useState("");
 const [memberId, setMemberId] = useState("");
 const [providerId, setProviderId] = useState("");
 const [claimType, setClaimType] = useState("Professional");
 const [serviceDate, setServiceDate] = useState("");
 const [billedAmount, setBilledAmount] = useState("");
 const [loading, setLoading] = useState(true);
 const [submitting, setSubmitting] = useState(false);
 const [error, setError] = useState("");
 const [claimLines, setClaimLines] = useState<ClaimLine[]>([
  {
    procedureCode: "",
    diagnosisCode: "",
    units: 1,
    billedAmount: 0,
  },
]);
 // Load members and providers
 useEffect(() => {
 const loadData = async () => {
 try {
 const [membersResponse, providersResponse] =
 await Promise.all([
 fetch(
 `${process.env.NEXT_PUBLIC_API_URL}/api/Members`
 ),
 fetch(
 `${process.env.NEXT_PUBLIC_API_URL}/api/Providers`
 ),
 ]);
 if (!membersResponse.ok) {
 throw new Error("Failed to load members.");
 }
 if (!providersResponse.ok) {
 throw new Error("Failed to load providers.");
 }
 const membersData =
 await membersResponse.json();
 const providersData =
 await providersResponse.json();
 setMembers(membersData);
 setProviders(providersData);
 } catch (error) {
 setError(
 error instanceof Error
 ? error.message
 : "Failed to load data."
 );
 } finally {
 setLoading(false);
 }
 };
 loadData();
 }, []);

const addClaimLine = () => {
  setClaimLines([
    ...claimLines,
    {
      procedureCode: "",
      diagnosisCode: "",
      units: 1,
      billedAmount: 0,
    },
  ]);
};

const removeClaimLine = (index: number) => {
  const updated = [...claimLines];
  updated.splice(index, 1);
  setClaimLines(updated);
};

const updateClaimLine = <K extends keyof ClaimLine>(
  index: number,
  field: K,
  value: ClaimLine[K]
) => {
  setClaimLines((prev) =>
    prev.map((line, i) =>
      i === index
        ? {
            ...line,
            [field]:value,
          }
        : line
    )
  );
};


// const updateClaimLine = (
//   index: number,
//   field: keyof ClaimLine,
//   value: string | number
// ) => {
//   const updated = [...claimLines];

//   updated[index] = {
//     ...updated[index],
//     value,
//   };

//   setClaimLines(updated);
// };



const totalBilledAmount = claimLines.reduce(
  (sum, line) => sum + Number(line.billedAmount || 0),
  0
);

 // Submit claim
 const handleSubmit = async (
 event: React.FormEvent
 ) => {
 event.preventDefault();
 setError("");
 if (
 !claimNumber ||
 !memberId ||
 !providerId ||
 !claimType ||
 !serviceDate ||
 !billedAmount
 ) {
 setError("Please fill in all required fields.");
 return;
 }
 setSubmitting(true);
 try {
 const response = await fetch(
 `${process.env.NEXT_PUBLIC_API_URL}/api/Claims`,
 {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
//  body: JSON.stringify({
//  claimNumber: claimNumber,
//  memberId: Number(memberId),
//  providerId: Number(providerId),
//  claimType: claimType,
//  serviceDate: serviceDate,
//  billedAmount: Number(billedAmount),
//  }),
body: JSON.stringify({
  claimNumber,
  memberId: Number(memberId),
  providerId: Number(providerId),
  claimType,
  serviceDate,
  billedAmount: totalBilledAmount,
  claimLines,
}),
 }
 );
 if (!response.ok) {
 const message = await response.text();
 throw new Error(
 message || "Failed to create claim."
 );
 }
 const createdClaim = await response.json();
 // Go to newly created claim
 router.push(
 `/claims/${createdClaim.claimId}`
 );
 } catch (error) {
 setError(
 error instanceof Error
 ? error.message
 : "Failed to create claim."
 );
 } finally {
 setSubmitting(false);
 }
 };
 if (loading) {
 return (
 <div className="min-h-screen bg-gray-100 p-8">
 Loading form...
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
 <main className="p-8">
 {/* Page Header */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-3xl font-bold text-gray-800">
 Create New Claim
 </h2>
 <p className="mt-2 text-gray-600">
 Submit a new healthcare claim.
 </p>
 </div>
 <button
 onClick={() => router.push("/claims")}
 className="bg-gray-800 text-white px-5 py-3 rounded-lg hover:bggray-700"
 >
 Back to Claims
 </button>
 </div>
 {/* Error */}
 {error && (
 <div className="bg-red-100 text-red-700 rounded-lg mt-6 p-4">
 {error}
 </div>
 )}
 {/* Form */}
 <form
 onSubmit={handleSubmit}
 className="bg-white rounded-lg shadow mt-8 p-8"
 >
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Claim Number */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb2">
 Claim Number
 </label>
 <input
 type="text"
 value={claimNumber}
 onChange={(e) =>
 setClaimNumber(e.target.value)
 }
 placeholder="Example: CLM-100010"
 className="w-full border border-gray-300 rounded-d px-3 py-2 bg-white text-gray-900"
 />
 </div>
 {/* Claim Type */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-
2">
 Claim Type
 </label>
 <select
 value={claimType}
 onChange={(e) =>
 setClaimType(e.target.value)
 }
 className="w-full border border-gray-300 rounded-d px-3 py-2 bg-white text-gray-900"
 >
 <option value="Professional">
 Professional
 </option>
 <option value="Institutional">
 Institutional
 </option>
 <option value="Dental">
 Dental
 </option>
 <option value="Pharmacy">
 Pharmacy
 </option>
 </select>
 </div>
 {/* Member */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb2">
 Member
 </label>
 <select
 value={memberId}
 onChange={(e) =>
 setMemberId(e.target.value)
 }
 className="w-full border border-gray-300 rounded-d px-3 py-2 bg-white text-gray-900"
 >
 <option value="">
 Select Member
 </option>
 {members.map((member) => (
 <option
 key={member.memberId}
 value={member.memberId}
 >
 {member.memberNumber} -{" "}
 {member.firstName}{" "}
 {member.lastName}
 </option>
 ))}
 </select>
 </div>
 {/* Provider */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb2">
 Provider
 </label>
 <select
 value={providerId}
 onChange={(e) =>
 setProviderId(e.target.value)
 }
 className="w-full border border-gray-300 rounded-d px-3 py-2 bg-white text-gray-900"
 >
 <option value="">
 Select Provider
 </option>
 {providers.map((provider) => (
 <option
 key={provider.providerId}
 value={provider.providerId}
 >
 {provider.providerName}{" "}
 ({provider.npi})
 </option>
 ))}
 </select>
 </div>
 {/* Service Date */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb2">
 Service Date
 </label>
 <input
 type="date"
 value={serviceDate}
 onChange={(e) =>
 setServiceDate(e.target.value)
 }
 className="w-full border border-gray-300 rounded-d px-3 py-2 bg-white text-gray-900"
 />
 </div>
 {/* Billed Amount */}
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Billed Amount
 </label>
 <input
 type="number"
 min="0"
 step="0.01"
 value={billedAmount}
 onChange={(e) =>
 setBilledAmount(e.target.value)
 }
 placeholder="Enter amount"
 className="w-full border border-gray-300 rounded-d px-3 py-2 bg-white text-gray-900"
 />
 </div>
 </div>

{/* Claim Lines */}
<div className="mt-10">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-xl font-semibold text-gray-800">
      Claim Lines
    </h3>

    <button
      type="button"
      onClick={addClaimLine}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    >
      Add Line
    </button>
  </div>

  {claimLines.map((line, index) => (
    <div
      key={index}
      className="border rounded-lg p-4 bg-gray-50 mb-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Procedure Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Procedure Code
          </label>

          <input
            type="text"
            value={line.procedureCode ?? ""}
            placeholder="99213"
            onChange={(e) =>
              updateClaimLine(
                index,
                "procedureCode",
                e.target.value
              )
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Diagnosis Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnosis Code
          </label>

          <input
            type="text"
            value={line.diagnosisCode ?? ""}
            placeholder="Z00.00"
            onChange={(e) =>
              updateClaimLine(
                index,
                "diagnosisCode",
                e.target.value
              )
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Units */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Units
          </label>

          <input
            type="number"
            min={1}
            value={line.units ?? ""}
            onChange={(e) =>
              updateClaimLine(
                index,
                "units",
                Number(e.target.value)
              )
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Billed Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billed Amount
          </label>

          <input
            type="number"
            min="0"
            step="1"
            value={line.billedAmount ?? ""}
            onChange={(e) =>
              updateClaimLine(
                index,
                "billedAmount",
                Number(e.target.value)
              )
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Remove */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => removeClaimLine(index)}
            disabled={claimLines.length === 1}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

{/* Claim Summary */}
<div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
  <h3 className="font-semibold text-blue-900">
    Claim Summary
  </h3>

  <div className="mt-2 text-blue-800">
    Total Claim Lines: {claimLines.length}
  </div>

  <div className="text-blue-800">
    Total Billed Amount: $
    {totalBilledAmount.toFixed(2)}
  </div>
</div>


 {/* Buttons */}
 <div className="flex gap-3 mt-8">
 <button
 type="submit"
 disabled={submitting}
 className="bg-blue-600 text-white px-6 py-3 rounded-lg 
hover:bg-blue-700 disabled:opacity-50"
 >
 {submitting
 ? "Submitting..."
 : "Submit Claim"}
 </button>
 <button
 type="button"
 onClick={() => router.push("/claims")}
 className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg 
hover:bg-gray-300"
 >
 Cancel
 </button>
 </div>
 </form>
 </main>
 </div>
 );
}
