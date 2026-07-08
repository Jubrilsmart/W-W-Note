import Link from "next/link";
import Image from "next/image";
import { shadow } from "@/styles/utils";
import { Button } from "@/components/ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";
import { getUser } from "@/auth/server";
import { SidebarToggle } from "./SidebarToggle";

async function Header() {
    const user = await getUser()
    return (
        <header className="bg-popover
        relative flex h-24 w-full 
        items-center justify-between 
        px-3 sm:px-8"
            style={{
                boxShadow: shadow,
            }}
        >
            <Link href="/" className="flex items-end gap-2">
                <div className="relative -left-5 bottom-4">
                    <SidebarToggle />
                </div>
                <Image
                    src="/book.png"
                    height={60}
                    width={60}
                    alt="logo"
                    className="rounded-full"
                    priority />

                <h1 className="flex flex-col pb-1 text-2xl font-semibold lead-6"
                >W❤️W <span>Notes</span></h1>
            </Link>
            <div className="flex gap-4">
                {user ? <LogOutButton /> :
                    (
                        <>
                            <Button asChild className="hidden sm:block">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/sign-up">Sign up</Link>
                            </Button>
                        </>
                    )}
                <DarkModeToggle />
            </div>
        </header>
    )
}

export default Header