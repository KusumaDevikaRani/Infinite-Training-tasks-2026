import Link from "next/link";
export default function Sidebar() {
 return (
 <aside className="w-64 min-h-[calc(100vh-73px)] bg-gray-900">
 <nav className="p-4 space-y-2">
 <Link
 href="/"
 className="px-4 py-3 rounded text-white hover:bg-gray-700  block"
 >
 Dashboard
 </Link>
 <Link
 href="/claims"
 className="px-4 py-3 rounded hover:bg-blue-700 !text-white font-medium hover:bg-blue-700 block"
 >
 Claims
 </Link>
 
 <Link href="/members" className="px-4 py-3 rounded text-white hover:bg-gray-700 cursorpointer block">
 Members
 </Link>
 
 <Link href="/providers" className="px-4 py-3 rounded text-white hover:bg-white-700 cursorpointer block">
 Providers
 </Link>
 
 
 </nav>
 </aside>
 );
}
