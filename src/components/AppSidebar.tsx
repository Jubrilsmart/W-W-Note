import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
  const user = await getUser();
  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {user ? ("Your notes"
            ) : (
              <p>
                <Link href="/login" className="underline">
                  Login
                </Link>{" "}
                to see your notes
              </p>
            )}
          </SidebarGroupLabel>
          {user && <SidebarGroupContent />}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar