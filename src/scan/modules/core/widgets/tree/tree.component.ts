import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ScanTreeNode } from '@models/ui';

@Component({
  selector: 'scan-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  @Input() nodes: ScanTreeNode[] = [];
  @Input() markedIds: number[] = [];
  @Input() mode: 'compact' | 'complete';
  @Input() segment?: string;
  @Input() styleClass: 'tree' | 'block' = 'tree';
  @Output() nodeClick = new EventEmitter<any>();

  @ViewChild('tree', { static: false }) tree: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit() {
    if (!!this.markedIds && this.markedIds.length > 0) {
      this.mark(this.markedIds);
    }
  }

  nodeClickHandler(data: any) {
    this.nodeClick.emit(data);
  }

  mark(ids?: (string | number)[]) {
    this.markNodes(this.nodes, ids);
  }

  private markNodes(nodes: ScanTreeNode[], ids: (string | number)[]) {
    nodes.forEach(node => {
      node.marked = ids && (ids.includes(node.dataId) || this.findMarkedDescendants(node.children, ids));
      if (node.children) {
        this.markNodes(node.children, ids);
      }
    });
  }

  private findMarkedDescendants(children: ScanTreeNode[], ids: (string | number)[]): boolean {
    let marked = false;
    if (!!children && children.length > 0) {
      for (const child of children) {
        if (ids.includes(child.dataId)) {
          marked = true;
          break;
        } else {
          if (!!child.children && child.children.length > 0) { // grandchildren
            marked = this.findMarkedDescendants(child.children, ids);
            if (marked) { break; }
          }
        }
      }
    }
    return marked;
  }

  highlight(ids?: (string | number)[], primaryId?: string | number) {
    console.log('I\'ve been called');
    this.highlightNodes(this.nodes, ids, primaryId);
  }

  private highlightNodes(nodes: ScanTreeNode[], ids: (string | number)[], primaryId: string | number) {
    nodes.forEach(node => {
      node.highlighted = (primaryId === node.dataId || (ids && ids.includes(node.dataId)));
      node.primary = primaryId === node.dataId;
      if (node.children) {
        this.highlightNodes(node.children, ids, primaryId);
      }
    });
  }

  scrollIntoView(id: string | number) {
    const element = this.tree.nativeElement.querySelector<HTMLElement>(`[data-id="${id}"]`);
    if (element) {
      element.scrollIntoView();
      window.scrollTo(0, 0);
    }
  }

}
