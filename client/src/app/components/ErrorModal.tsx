"use client";

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearError } from "@/lib/store/slices/boardSlice";

export default function ErrorModal() {
	const dispatch = useAppDispatch();
	const [status, error] = useAppSelector((state) => [
		state.board.status,
		state.board.error,
	]);

	const handleClose = () => {
		dispatch(clearError());
	};

	return (
		<Modal isOpen={status == "error"} onOpenChange={handleClose}>
			<ModalContent className="bg-red-200">
				<ModalHeader className="text-red-600">Error!</ModalHeader>
				<ModalBody className="text-black">{error}</ModalBody>
				<ModalFooter>
					<Button color="danger" onPress={handleClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
