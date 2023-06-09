import type { BrandedType } from "@/utils/branded-type"
import { ethers } from "ethers"

export type Address = BrandedType<string, "Address">
export namespace Address {
	export function from(value: string): Address {
		const bytes = ethers.toBeArray(value)
		if (bytes.byteLength !== 20) throw new Error(`Address length of ${value} doesn't match. Got length ${bytes.byteLength}, expected ${20}`)
		return ethers.hexlify(bytes) as Address
	}

	export function isAddress(value: string): value is Address {
		try {
			Address.from(value)
			return true
		} catch (error) {
			return false
		}
	}
}
