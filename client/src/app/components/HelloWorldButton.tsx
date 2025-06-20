"use client";
import { helloWorld } from "@/lib/requests/common";

export default function HelloWorldButton() {
	return (
		<button
			className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
			onClick={async () => {
				try {
					console.log(process.env);
					const response = await helloWorld();
					alert(`Response: ${response}`);
				} catch (error) {
					alert(
						`Error: ${error instanceof Error ? error.message : "Unknown error"}`
					);
				}
			}}
		>
			Fetch Hello World
		</button>
	);
}
