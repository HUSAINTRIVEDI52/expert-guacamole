import React, { useEffect, useRef, useState } from "react";
import { googleAuthAction } from "@/app/(auth)/actions";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string | undefined;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            config: {
              theme: string;
              size: string;
              width: number;
              text: string;
              shape: string;
            },
          ) => void;
        };
      };
    };
  }
}

export const SocialLogin: React.FC = () => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: googleButtonRef.current.offsetWidth || 400, // Fallback width
          text: "continue_with",
          shape: "pill", // Use pill shape for a more premium look
        });
      }
    };

    const handleCredentialResponse = async (response: {
      credential: string;
    }) => {
      setError(null);
      const result = await googleAuthAction(response.credential);
      if (result.success) {
        router.push("/dashboard");
      } else if (result.error) {
        setError(result.error);
      }
    };

    if (window.google) {
      initializeGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogle();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [router]);

  return (
    <div className="w-full md:space-y-6 space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-[13px] font-medium text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <div className="relative flex items-center gap-4 py-2">
        <div className="flex-grow border-t border-[#EEEEEA]"></div>
        <span className="md:text-[15px] text-[14px] text-[#888888] uppercase tracking-wider font-noto-sans">
          Or
        </span>
        <div className="flex-grow border-t border-[#EEEEEA]"></div>
      </div>

      <div className="flex flex-col items-center">
        <div ref={googleButtonRef} className="w-full flex justify-center" />
      </div>
    </div>
  );
};
