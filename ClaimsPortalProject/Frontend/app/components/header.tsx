import Link from "next/link";
export default function Header() {
 return (
 <header className="bg-white border-b">
   <div className="flex items-center justify-between px-8 py-4">
     <h1 className="text-2xl font-bold text-gray-500">
        Claim's Portal
     </h1>

     <div className="text-sm text-gray-600">
        Claims
     </div>
   </div>
 </header>
 );
}
