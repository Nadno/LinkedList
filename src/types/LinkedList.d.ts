declare module "LinkedList" {
  export type ForEachCallback = (node: IListNode, index: number) => void;
  export interface ILinkedList {
    firstNode: IListNode;
    lastNode: IListNode;
    length: number;

    forEach(callback: ForEachCallback): void;
    push(value: any): void;
    pop(): any;
    unshift(value: any): void;
    shift(): any;
  }
  
  export interface IListNode {
    value: any;
    next?: IListNode;
    prev?: IListNode;

    insertNext(value: any): IListNode;
    remove(): IListNode;
  }
}