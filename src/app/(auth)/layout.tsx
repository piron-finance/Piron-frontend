import Link from "next/link";
import { Crown } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container flex h-14 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Morph Guild</span>
            </Link>
            <div className="ml-auto flex items-center space-x-4">
              <nav className="flex items-center space-x-2">
                <Link
                  href="/signin"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Sign In
                </Link>
                <span className="text-sm text-muted-foreground">/</span>
                <Link
                  href="/signup"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Sign Up
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t py-4">
          <div className="container flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Morph Guild. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-3 sm:mt-0">
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="/help"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Help
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
