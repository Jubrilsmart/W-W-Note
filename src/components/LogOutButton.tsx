"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logOutAction } from "@/actions/users";

function LogOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); 

  const handleLogOut = async () => {
    setLoading(true);

    const {errorMessage} = await logOutAction();

    if (!errorMessage) {
      toast.success("Logging out", {
        description: "You have successfully logged out",
      });
      router.push("/");
    }else {
        toast.error("error",
            {description: errorMessage}
        )
    }
    setLoading(false);
}
  return (
    <Button
      variant="outline"
      onClick={handleLogOut}
      disabled={loading}
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
    </Button>
  );
}

export default LogOutButton;
