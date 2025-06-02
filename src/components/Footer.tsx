export function Footer() {
  return (
    <footer className="w-full border-t border-black/10 dark:border-white/10 py-4 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} EcoCoin Space</p>
    </footer>
  );
}