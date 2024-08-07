"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Spinner } from "../Spinner";
import { toast } from "sonner";
import { Modal, ModalButtons, ModalHeader } from "../Modal";
import { useSignIn } from "@/app/lib/hooks/use-sign-in";

const SignInModal = () => {
  const { status } = useSession();
  const signInState = useSignIn();
  const [isSigningInLoading, setIsSigningInLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const hasSignedInBefore = localStorage.getItem("hasSignedInBefore");

      if (!hasSignedInBefore) {
        toast.success("Successfully signed in!");
        localStorage.setItem("hasSignedInBefore", "true");
      }
    }
  }, [status]);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningInLoading(true);
      await signIn("google");
    } catch (error) {
      setIsSigningInLoading(false);
    }
  };
  return (
    <Modal
      isOpen={signInState.isOpen}
      onClose={signInState.onClose}
      className="max-w-[448px] w-full"
    >
      <ModalHeader title="Login is required to continue" titleAlign="left" />
      {isSigningInLoading ? (
        <div className="flex-center h-full w-full">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <ModalButtons
          modalButtonClassName="w-full h-16 flex-center"
          buttons={[
            {
              text: "Sign in with Google",
              onClick: handleGoogleSignIn,
              iconLeft: "google",
              iconRight: "arrowTopRight",
              className:
                "flex-center w-full h-full border-accent-foreground border-2 text-accent-foreground w-full hover:bg-accent-foreground text-accent-foreground hover:text-foreground",
            },
          ]}
        />
      )}
    </Modal>
  );
};

export default SignInModal;
