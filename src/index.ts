'use strict';

import _ from 'lodash';
import { DomElement } from 'htmlparser2';
import { AccessibilityTree, AccessibilityTreeOptions, AccessibleElement } from '@qualweb/accessibility-tree';
import { createAccessibleElement } from './lib';

function processElement(element: DomElement, dom: DomElement[], setReferences: boolean): AccessibleElement | null {
  const accessibleElement = createAccessibleElement(element, dom, setReferences);

  for (const ele of element.children || []) {
    const newElement = processElement(ele, dom, setReferences);
    if (newElement && accessibleElement) {
      const ae = _.cloneDeep(newElement);
      if (accessibleElement.nElements !== undefined && ae.nElements !== undefined) {
        accessibleElement.nElements = ae.nElements + 1;
      }
      if (accessibleElement.children) {
        accessibleElement.children.push(ae);
      }
    }
  }

  return accessibleElement;
}

async function generateAccessibilityTree(dom: DomElement[], options?: AccessibilityTreeOptions): Promise<AccessibilityTree> {
  const setReferences: boolean = options ? options.setReferences || false : false;

  const AT = {
    nElements: 0,
    containsReferences: setReferences
  };

  for (const element of dom || []) {
    if (element.type === 'tag' && element.name === 'html') {
      const tree = createAccessibleElement(element, dom, setReferences);
      if (tree) {
        for (const element2 of element.children || []) {
          if (element2.type === 'tag' && element2.name === 'body') {
            for (const element3 of element2.children || []) {
              if (tree.children) {
                const newElement = processElement(element3, dom, setReferences);
                if (newElement) {
                  const processedElement = _.cloneDeep(newElement);
                  if (tree.nElements !== undefined && processedElement.nElements !== undefined) {
                    tree.nElements += processedElement.nElements;
                  }
                  tree.children.push(processedElement);
                }
              }
            }
            break;
          }
        }
        if (tree.nElements !== undefined && tree.children !== undefined) {
          tree.nElements = tree.nElements + tree.children.length;
        }
        AT.nElements = tree.nElements !== undefined ? tree.nElements + 1 : 0;
        AT['tree'] = _.cloneDeep(tree);
      }
      break;
    }
  }

  return <AccessibilityTree> AT;
}

export {
  generateAccessibilityTree
};