import { Outlet } from "react-router-dom";

export default function RootLayout() {

    return (
        <main className="min-h-screen bg-zinc-950 text-white">

            <Outlet />

        </main>
    );

}