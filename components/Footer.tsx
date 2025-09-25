export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200/60 mt-12">
      <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-gray-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Sophie. All rights reserved.</p>
        <p>Built with Next.js, Tailwind, and Notion</p>
      </div>
    </footer>
  );
}


