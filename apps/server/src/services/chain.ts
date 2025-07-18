import type { Types } from 'aptos';
import { AptosAccount, AptosClient } from 'aptos';
import { Buffer } from 'node:buffer';

/**
 * Supply Chain Management System using MOVE SDK - Aptos
 * This module provides TypeScript interfaces to interact with the Move module
 * 
 * @example
 * ```move
 module SupplyChain::product_manager {

    struct Product has key {
        id: u64,
        manufacturer: address,
        current_owner: address,
        metadata: vector<u8>, // name, description, date, ipfs link
        history: vector<address>,
    }

    public entry fun mint_product(account: &signer, id: u64, metadata: vector<u8>) {
        let product = Product {
            id,
            manufacturer: signer::address_of(account),
            current_owner: signer::address_of(account),
            metadata,
            history: vector::empty(),
        };
        move_to(account, product);
    }

    public fun get_product_info(id: u64): &Product {
        // lookup product by ID
    }

    public entry fun transfer_product(sender: &signer, new_owner: address, id: u64) {
        // check ownership, then update history and owner
    }
}
    ```
 */

// Define module constants
/**
 * TODO: Replace with the actual address where the module is deployed
 */
const MODULE_ADDRESS = '0x1';
const MODULE_NAME = 'SupplyChain';
const RESOURCE_NAME = 'product_manager';

const MODULE = `${MODULE_ADDRESS}::${MODULE_NAME}::${RESOURCE_NAME}`;
const MINT_PRODUCT = `${MODULE}::mint_product`;
const GET_PRODUCT_INFO = `${MODULE}::get_product_info`;
const TRANSFER_PRODUCT = `${MODULE}::transfer_product`;

export interface ProductMetadata {
	name: string;
	description: string;
	dateManufactured: Date;
	ipfsLink?: string;
	additionalInfo?: Record<string, string>;
}

export interface ProductInfo {
	id: string;
	manufacturer: string;
	currentOwner: string;
	metadata: ProductMetadata;
	history: string[];
}

/**
 * Initialize the SupplyChain instance
 * @param nodeUrl URL of the Aptos node
 * @param privateKey Optional private key for company account
 */
export class SupplyChain {
	/**
	 * `AptosClient` is your gateway to the blockchain,
	 * it provides methods to interact with the Aptos blockchain.
	 */
	private client: AptosClient;
	/**
	 * `AptosAccount` represents a user's account.
	 */
	private companyAccount: AptosAccount | undefined;

	constructor(nodeUrl: string, privateKey?: string) {
		this.client = new AptosClient(nodeUrl);

		// If a private key is provided, create the company's account
		if (privateKey) {
			this.companyAccount = new AptosAccount(
				Buffer.from(privateKey.replace('0x', ''), 'hex'),
			);
		}
	}

	/**
	 * Mint a new product on the blockchain
	 * @param productId Unique identifier for the product
	 * @param metadata Product metadata (name, description, etc.)
	 * @returns Transaction hash
	 */
	async mintProduct(
		productId: string,
		metadata: ProductMetadata,
	): Promise<string> {
		if (!this.companyAccount) {
			throw new Error(
				'Company account not initialized. Provide a private key in the constructor.',
			);
		}

		// Serialize metadata to bytes for on-chain storage
		const serializedMetadata = Buffer.from(JSON.stringify(metadata)).toString(
			'hex',
		);

		const payload: Types.EntryFunctionPayload = {
			function: MINT_PRODUCT,
			type_arguments: [],
			arguments: [productId, `0x${serializedMetadata}`],
		};

		const txnRequest = await this.client.generateTransaction(
			this.companyAccount.address(),
			payload,
		);

		const signedTxn = await this.client.signTransaction(
			this.companyAccount,
			txnRequest,
		);

		const txnResult = await this.client.submitTransaction(signedTxn);
		await this.client.waitForTransaction(txnResult.hash);

		return txnResult.hash;
	}

	/**
	 * Transfer ownership of a product to a new owner
	 * @param productId Product identifier
	 * @param newOwnerAddress Blockchain address of the new owner
	 * @returns Transaction hash
	 */
	async transferProduct(
		productId: string,
		newOwnerAddress: string,
	): Promise<string> {
		if (!this.companyAccount) {
			throw new Error(
				'Company account not initialized. Provide a private key in the constructor.',
			);
		}

		const payload: Types.EntryFunctionPayload = {
			function: TRANSFER_PRODUCT,
			type_arguments: [],
			arguments: [newOwnerAddress, productId],
		};

		const txnRequest = await this.client.generateTransaction(
			this.companyAccount.address(),
			payload,
		);

		const signedTxn = await this.client.signTransaction(
			this.companyAccount,
			txnRequest,
		);

		const txnResult = await this.client.submitTransaction(signedTxn);
		await this.client.waitForTransaction(txnResult.hash);

		return txnResult.hash;
	}

	/**
	 * Get product information from the blockchain
	 * @param productId Product identifier
	 * @returns Product information or null if not found
	 */
	async getProductInfo(productId: string): Promise<ProductInfo | null> {
		try {
			// Call the Move function to get product info
			const response = await this.client.view({
				function: GET_PRODUCT_INFO,
				type_arguments: [],
				arguments: [productId],
			});

			if (!response || !response.length) {
				return null;
			}

			// Parse the response from the blockchain
			const [id, manufacturer, currentOwner, metadataHex, historyArray] =
				response;

			// Deserialize metadata from hex
			const metadataJson = Buffer.from(
				metadataHex.toString().substring(2),
				'hex',
			).toString('utf8');
			const metadata = JSON.parse(metadataJson) as ProductMetadata;

			return {
				id: id as string,
				manufacturer: manufacturer as string,
				currentOwner: currentOwner as string,
				metadata,
				history: historyArray as string[],
			};
		} catch (error) {
			console.error('Error fetching product info:', error);
			return null;
		}
	}

	/**
	 * Check if a product exists on the blockchain
	 * @param productId Product identifier
	 * @returns Boolean indicating if the product exists
	 */
	async checkOnChainExist(productId: string): Promise<boolean> {
		const productInfo = await this.getProductInfo(productId);
		return productInfo !== null;
	}

	/**
	 * Verify product authenticity
	 * @param productId Product identifier
	 * @param expectedManufacturer Address of the expected manufacturer
	 * @returns Verification result with details
	 */
	async verifyProduct(
		productId: string,
		expectedManufacturer: string,
	): Promise<{
		exists: boolean;
		isAuthentic: boolean;
		manufacturer?: string;
		currentOwner?: string;
		transferCount?: number;
	}> {
		const productInfo = await this.getProductInfo(productId);

		if (!productInfo) {
			return { exists: false, isAuthentic: false };
		}

		const isAuthentic = productInfo.manufacturer === expectedManufacturer;

		return {
			exists: true,
			isAuthentic,
			manufacturer: productInfo.manufacturer,
			currentOwner: productInfo.currentOwner,
			transferCount: productInfo.history.length,
		};
	}

	/**
	 * Generate QR code data for a product
	 * @param productId Product identifier
	 * @param dAppUrl Optional dApp URL to include in QR
	 * @returns String to be encoded in QR code
	 */
	generateProductQrData(productId: string, dAppUrl?: string): string {
		if (dAppUrl) {
			// Format: https://example.com/verify?id=123
			return `${dAppUrl}/verify?id=${productId}`;
		}

		// Format: supplychain:product:123
		return `supplychain:product:${productId}`;
	}
}

const nodeUrl =
	process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com/v1';
const supplyChain = new SupplyChain(nodeUrl);

// Export the legacy function for backward compatibility
export const checkOnChainExist = async (id: string): Promise<boolean> => {
	return await supplyChain.checkOnChainExist(id);
};
