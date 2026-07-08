"use client"

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";


type Props = {
  user: User | null;
};

function AskAIButton({ user }: Props) {
  console.log(user?.email)
  return (
    <Button className="">
      Ask AI
    </Button>
  )
}

export default AskAIButton