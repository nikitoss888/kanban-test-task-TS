import { Input, Textarea } from "@heroui/react";

interface InputsProps {
	title: string;
	setTitle: React.Dispatch<React.SetStateAction<string>>;
	description: string;
	setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export default function Inputs({
	title,
	setTitle,
	description,
	setDescription,
}: Readonly<InputsProps>) {
	return (
		<div className="flex flex-col items-center gap-4 w-full">
			<div className="w-full">
				<label className="flex flex-col gap-1">
					Title:
					<Input
						name="title"
						description="Input card title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						size="sm"
					/>
				</label>
			</div>

			<div className="w-full">
				<label className="flex flex-col gap-1">
					Description:
					<Textarea
						name="description"
						description="Input card's description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</label>
			</div>
		</div>
	);
}
