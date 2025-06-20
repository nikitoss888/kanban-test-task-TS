"use client";

import React, { ChangeEvent, useState } from "react";
import { createBoard, getBoard } from "@/lib/requests/board";
import { Button, Input, Tooltip,
    Modal, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure, } from "@heroui/react";
import { useMask } from "@react-input/mask";

export default function BoardForm() {
	const [id, setId] = useState("");
	const [name, setName] = useState("");
    const [error, setError] = useState("");

	const idMask =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

	const inputRef = useMask({
		mask: "________-____-____-____-____________",
		replacement: { _: /[0-9a-f]/ },
	});

    const blocked = id && !idMask.test(id) || name === "";

	const onClick = async () => {
		let result;
		console.log(id, idMask.test(id));
		if (blocked) return;

		if (id) {
			result = await getBoard(id);
		} else if (name) {
            result = await createBoard(name);
		}
		
        if (!result.error) {
            setId(result.id);
        }
        else {
            setError(result.error);
        }
	};

	return (
		<div className="flex flex-wrap items-center gap-4 w-full">
			<div className="min-w-[220px]">
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

			<div className="flex-auto">
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
                content={id ? "Read board by provided UUID" : "Create boards with specified name"}
                className="bg-gray-600"
            >
                <Button
                    radius="sm"
                    color="primary"
                    onPress={onClick}
                    isDisabled={blocked}
                    className="w-40"
                >
                    {id ? "Read board" : "Create board"}
                </Button>
            </Tooltip>
            <Modal>
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">Error!</ModalHeader>
                        <ModalBody>
                            <p>
                                {error}
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose & setError("")}>
                                Close
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
		</div>
	);
}
