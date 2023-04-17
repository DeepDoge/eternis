import { address, Address } from "@/utils/address"
import { BigNumber, ethers } from "ethers"
import { cacheExchange, createClient, fetchExchange, gql } from "urql"

const client = createClient({
	url: "https://api.studio.thegraph.com/query/45351/dforum/v0.0.25",
	exchanges: [cacheExchange, fetchExchange]
})

export type PostData = {
	id: BigNumber
	author: Address
	contents: { type: string; value: Uint8Array }[]
	createdAt: Date
}

export async function getPosts(author: Address): Promise<PostData[]> {
	return (
		await client
			.query(
				gql`
					{
						posts(
							first: 5
							orderBy: blockTimestamp
                            orderDirection: desc 
							where: { and: [
                                { or: [{ postContent_: { value_not: "" } }, { postContent_: { type_not: "" } }] }, 
                                { author: "${author}" } 
                            ] }
						) {
							id
							author
							postContent {
								type
								value
							}
                            blockTimestamp
						}
					}
				`,
				{}
			)
			.toPromise()
	).data.posts.map(
		(post: any): PostData => ({
			id: BigNumber.from(post.id),
			author: address(post.author),
			contents: post.postContent.map((content: any): PostData["contents"][number] => ({
				type: content.type,
				value: ethers.utils.arrayify(content.value)
			})),
			createdAt: new Date(parseInt(post.blockTimestamp) * 1000)
		})
	)
}