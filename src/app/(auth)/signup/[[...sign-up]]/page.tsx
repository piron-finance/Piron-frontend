import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="mb-4">
            <Image
              src="/morphLogo.png"
              alt="Morph"
              width={120}
              height={40}
              className="h-20 w-auto"
            />
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-green-600 hover:bg-green-700 text-sm normal-case",
                card: "bg-white shadow-none",
                headerTitle: "sign up to Morph Guild",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border-gray-300 hover:bg-gray-50 text-gray-900 normal-case",
                footerAction: "text-gray-600",
                footerActionLink: "text-blue-600 hover:text-blue-700",
              },
            }}
            routing="path"
            path="/signup"
            signInUrl="/signin"
          />
        </div>
      </div>
    </div>
  );
}
