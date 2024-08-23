import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface File {
  'id' : bigint,
  'content' : Uint8Array | number[],
  'name' : string,
  'createdAt' : Time,
  'size' : bigint,
}
export type Result = { 'ok' : bigint } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'deleteFile' : ActorMethod<[bigint], Result_1>,
  'getFiles' : ActorMethod<[], Array<File>>,
  'uploadFile' : ActorMethod<[string, Uint8Array | number[]], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
