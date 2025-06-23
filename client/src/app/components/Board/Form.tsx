"use client";

import React, { useState } from "react";
import { Button, Input, Tooltip } from "@heroui/react";
import { useMask } from "@react-input/mask";
import { useAppDispatch } from "@/lib/store/hooks";
import { createBoard, fetchBoard } from "@/lib/store/slices/boardSlice";

export default function Form() {
	const [id, setId] = useState("");
	const [name, setName] = useState("");

	const dispatch = useAppDispatch();

	const idMask =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

	const inputRef = useMask({
		mask: "________-____-____-____-____________",
		replacement: { _: /[0-9a-f]/ },
	});

	const blocked = (id && !idMask.test(id)) || (!id && name === "");

	const onClick = async () => {
		console.log(id, idMask.test(id));
		if (blocked) return;

		if (id) {
			dispatch(fetchBoard(id));
		} else if (name) {
			dispatch(createBoard(name));
		}
	};

	return (
		<div className="flex flex-wrap items-center gap-4 w-full">
			<div className="flex-auto">
				<label className="flex flex-col gap-1">
					Name:
					<Input
						name="name"
						description="Input board name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						size="sm"
					/>
				</label>
			</div>

			<div className="flex-auto min-w-sm">
				<label className="flex flex-col gap-1">
					UUID:
					<Input
						name="id"
						description="Input your Board UUID"
						ref={inputRef}
						type="text"
						value={id}
						onChange={(e) => setId(e.target.value)}
						placeholder="e69baa56-f591-4a21-b4e9-9401bf1b14eb"
						size="sm"
					/>
				</label>
			</div>

			<Tooltip
				content={
					id
						? "Read board by provided UUID"
						: "Create boards with specified name"
				}
				className="bg-gray-600"
			>
				<Button
					radius="sm"
					color="primary"
					onPress={onClick}
					isDisabled={blocked}
					className="flex-1"
				>
					{id ? "Read board" : "Create board"}
				</Button>
			</Tooltip>
		</div>
	);
}
