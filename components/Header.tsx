import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200/60">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-wide">Sophie</Link>
        <nav className="flex items-center gap-6 text-sm text-gray-600">
          <Link href="/">Home</Link>
          <a href="https://vercel.com" target="_blank" rel="noreferrer">Vercel</a>
        </nav>
      </div>
    </header>
  );
}


