"use client";

import Containers from "./Board/Containers";
import Form from "./Board/Form";
import { useAppSelector } from "@/lib/store/hooks";

export default function Board() {
	const board = useAppSelector((state) => state.board.board);

	return (
		<>
			<h1 className="text-[32px] sm:text-[48px] font-bold">
				Kanban Board
			</h1>
			<Form />
			{board && (
				<div className="w-1/2">
					<h2 className="text-[24px] sm:text-[32px] font-bold">{board.name}</h2>
                    <p>ID: {board.id}</p>
				</div>
			)}
            <Containers />
		</>
	);
}
