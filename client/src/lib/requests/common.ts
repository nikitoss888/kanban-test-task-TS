export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const request = async (
	method: "POST" | "GET" | "PATCH" | "DELETE",
	url: string = "/",
	body?: string
): Promise<Response> =>
	fetch(`${API_URL}${url}`, {
		method,
		headers: {
			"Content-Type": "application/json",
		},
		body,
	});

export const helloWorld = async () => {
	console.log(API_URL);
	const data = await request("GET").then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			throw Error("Error reading response");
		}
	});
	console.log(data);

	return data;
};
