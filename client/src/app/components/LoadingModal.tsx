"use client";

import { Modal, ModalContent, Spinner } from "@heroui/react";
import { useAppSelector } from "@/lib/store/hooks";

export default function LoadingModal() {
	const status = useAppSelector((state) => state.board.status);

	return (
		<Modal
			isOpen={status === "loading"}
			backdrop="blur"
			size="md"
			isDismissable={false}
			hideCloseButton
		>
			<ModalContent className="h-30 w-30 rounded-full">
				<div className="flex items-center justify-center h-full">
					<Spinner size="lg" />
				</div>
			</ModalContent>
		</Modal>
	);
}
