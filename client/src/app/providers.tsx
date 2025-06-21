"use client";

import { HeroUIProvider } from "@heroui/react";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";

export default function Providers({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<HeroUIProvider>
			<Provider store={store}>{children}</Provider>
		</HeroUIProvider>
	);
}
