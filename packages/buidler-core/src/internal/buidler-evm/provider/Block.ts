import EthBlock from "ethereumjs-block";
import Common from "ethereumjs-common";
import { BufferLike, Transaction, TxData } from "ethereumjs-tx";
import { BN } from "ethereumjs-util";

import { BlockchainInterface } from "./BlockchainInterface";
import { Callback } from "./Callback";

export const Block: Block = EthBlock;

export interface Block {
  readonly header: BlockHeader;
  readonly transactions: Transaction[];
  readonly uncleHeaders: BlockHeader[];
  readonly txTrie: any;

  readonly _common: Common;

  // tslint:disable-next-line:no-misused-new
  new (data?: BlockData | null, chainOptions?: { common: Common }): Block;

  hash(): Buffer;
  isGenesis(): boolean;
  setGenesisParams(): void;

  serialize(rlpEncode?: true): Buffer;
  serialize(rlpEncode: false): [Buffer[], Buffer[], Buffer[]];

  genTxTrie(cb: Callback): void;
  validateTransactionsTrie(): boolean;

  validateTransactions(stringError?: false): boolean;
  validateTransactions(stringError: true): string;

  validate(blockchain: BlockchainInterface, cb: Callback): void;
  validateUnclesHash(): boolean;
  validateUncles(blockchain: BlockchainInterface, cb: Callback): void;
  toJSON(labeled?: boolean): any;
}

interface BlockHeader {
  _common: Common;

  parentHash: Buffer;
  uncleHash: Buffer;
  coinbase: Buffer;
  stateRoot: Buffer;
  transactionsTrie: Buffer;
  receiptTrie: Buffer;
  bloom: Buffer;
  difficulty: Buffer;
  number: Buffer;
  gasLimit: Buffer;
  gasUsed: Buffer;
  timestamp: Buffer;
  extraData: Buffer;
  mixHash: Buffer;
  nonce: Buffer;

  canonicalDifficulty(parentBlock: Block): BN;
  validateDifficulty(parentBlock: Block): boolean;
  validateGasLimit(parentBlock: Block): boolean;

  validate(blockchain: BlockchainInterface, height: BN, cb: Callback): boolean;
  validate(blockchain: BlockchainInterface, cb: Callback): boolean;

  hash(): Buffer;
  isGenesis(): boolean;
  setGenesisParams(): void;
}

export interface BlockData {
  header?: BlockHeaderData;
  transactions?: TxData[];
  uncleHeaders?: BlockHeaderData[];
}

export interface BlockHeaderData {
  parentHash?: BufferLike;
  uncleHash?: BufferLike;
  coinbase?: BufferLike;
  stateRoot?: BufferLike;
  transactionsTrie?: BufferLike;
  receiptTrie?: BufferLike;
  bloom?: BufferLike;
  difficulty?: BufferLike;
  number?: BufferLike;
  gasLimit?: BufferLike;
  gasUsed?: BufferLike;
  timestamp?: BufferLike;
  extraData?: BufferLike;
  mixHash?: BufferLike;
  nonce?: BufferLike;
}
