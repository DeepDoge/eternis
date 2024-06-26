import { DB } from "@modules/database";
import { bigint, object, string, unknown } from "zod";
import { Address, Bytes32 } from "./types";

export const db = DB.create("eternis.posts")
	.version(1, {
		KV: DB.ModelBuilder()
			.parser(
				object({
					key: string(),
					value: unknown(),
				}).strict().parse,
			)
			.key({ keyPath: "key" })
			.build(),
		Feed: DB.ModelBuilder()
			.parser(
				object({
					indexerContractAddress: Address,
					feedId: Bytes32,
					length: bigint(),
				}).strict().parse,
			)
			.key({ keyPath: ["indexerContractAddress", "feedId"] })
			.index({ field: "feedId", options: {} })
			.build(),
		PostIndex: DB.ModelBuilder()
			.parser(
				object({
					indexerContractAddress: Address,
					feedId: Bytes32,
					indexHex: string(),
					postIdHex: string(),
					/** Most likely a `proxyContractAddress` */
					senderAddress: Address,
					originAddress: Address,
					timestamp: bigint(),
				}).strict().parse,
			)
			.key({ keyPath: ["indexerContractAddress", "feedId", "indexHex"] })
			.index({ field: ["indexerContractAddress", "feedId", "indexHex"], options: {} })
			.index({ field: ["senderAddress", "postIdHex"], options: { unique: true } }) // Sender decides the post ID
			.index({ field: "originAddress", options: {} })
			.build(),
		Post: DB.ModelBuilder()
			.parser(
				object({
					proxyContractAddress: Address,
					postIdHex: string(),
					content: string(),
				}).strict().parse,
			)
			.key({ keyPath: ["proxyContractAddress", "postIdHex"] })
			.build(),
	})
	.build();
