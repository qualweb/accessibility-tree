'use strict';

import { AccessibleElement } from '@qualweb/accessibility-tree';
import { DomElement, DomUtils } from 'htmlparser2';
const stew = new(require('stew-select')).Stew();

function createAccessibleElement(element: DomElement, dom: DomElement[], setReferences: boolean): AccessibleElement {
  switch(element.name) {
    case 'html':
      return processHtmlElement(element, dom, setReferences);
    case 'img': 
      return processImgElement(element, dom, setReferences);
    case 'p':
      return processPElement(element, dom, setReferences);
    default:
      throw new Error(`Element ${element.name} not yet supported`);
  }
}

/* ELEMENT FUNCTIONS */

function processHtmlElement(element: DomElement, dom: DomElement[], setReferences: boolean): AccessibleElement {
  const title = stew.select(dom, 'html > head > title');
  let name = '';
  if(title.length > 0) {
    name = DomUtils.getText(title[0]);
  }

  const ae: AccessibleElement = {
    name,
    role: 'WebArea',
    children: new Array<AccessibleElement>()
  };

  if (setReferences) {
    ae.reference = 'WebArea';
    ae.nElements = 0;
    ae.element = 'html';
    ae.nameFrom = {
      type: 'element',
      element: 'title',
      elementReference: getElementSelector(title[0])
    };
    if (element.attribs && element.attribs.id) {
      ae.nameFrom.elementId = element.attribs.id;
    }
  }

  return ae;
}

function processImgElement(element: DomElement, dom: DomElement[], setReferences: boolean): AccessibleElement {
  let ae = {};
  ae = fillAvailableAttributes(element, dom, ae, setReferences);
  if (setReferences) {
    ae = fillElementOwnReferences(element, ae);
  }
  ae = calculateElementAccessibleName(element, ae, setReferences);

  if (!ae['role']) {
    ae['role'] = 'img';
  }

  return <AccessibleElement> ae;
}

function processPElement(element: DomElement, dom: DomElement[], setReferences: boolean): AccessibleElement {

}

/* END OF ELEMENT FUNCTIONS */

function fillAvailableAttributes(element: DomElement, dom: DomElement[], ae: any, setReferences: boolean): any {
  if (element.attribs) {
    if (element.attribs.alt !== undefined) {
      ae['alt'] = element.attribs.alt;
    }
    if (element.attribs.title !== undefined) {
      ae['title'] = element.attribs.title;
    }
    if (element.attribs['aria-label'] !== undefined) {
      ae['aria-label'] = element.attribs['aria-label'];
    }
    if (element.attribs['aria-labelledby'] !== undefined) {
      const reference = stew.select(dom, element.attribs['aria-labelledby']);
      if (reference.length > 0) {
        ae['aria-labelledby'] = DomUtils.getText(reference[0]);
        if (setReferences) {
          ae = fillElementReferences(ae, reference[0]);
        }
      } else {
        ae['aria-labelledby'] = '';
      }
    }
    if (element.attribs.role !== undefined) {
      ae.role = element.attribs.role;
    }
  }

  return ae;
}

function calculateElementAccessibleName(element: DomElement, ae: any, setReferences: boolean): any {
  let name = '';

  if(ae.alt) {
    name = ae.alt;
    if (setReferences) {
      if (!ae.nameFrom) {
        ae.nameFrom = {};
      }
      ae.nameFrom.type = 'attribute';
      ae.nameFrom.attribute = 'alt';
      ae.nameFrom.element = element.name;
      ae.nameFrom.elementReference = getElementSelector(element);
      if (element.attribs && element.attribs.id) {
        ae.nameFrom.elementId = element.attribs.id;
      }
    }
  }
  if(ae.title) {
    name = ae.title;
  }
  if(ae['aria-label']) {
    name = ae['aria-label'];
  }
  if(ae['aria-labelledby']) {
    name = ae['aria-labelledby'];
  }

  ae.name = name;
  return ae;
}

function fillElementReferences(ae: any, referencedElement: DomElement): any {
  if (!ae.nameFrom) {
    ae.nameFrom = {};
  }
  ae.nameFrom.type = 'element';
  ae.nameFrom.element = referencedElement[0].name;
  ae.nameFrom.elementReference = getElementSelector(referencedElement[0]);
  if (referencedElement[0].attribs && referencedElement[0].attribs.id) {
    ae.nameFrom.elementId = referencedElement[0].attribs.id;
  }

  return ae;
}

function fillElementOwnReferences(element: DomElement, ae: any): any {
  ae.element = element.name;
  ae.nElements = 0;
  //ae.reference = 
  
  return ae;
}

function getElementSelfLocationInParent(element: DomElement): string {
  let selector = '';

  if (element.name === 'body' || element.name === 'head') {
    return element.name;
  }

  let sameEleCount = 0;

  let prev = element.prev;
  while(prev) {
    if (prev.type === 'tag'&& prev.name === element.name) {
      sameEleCount++;
    }
    prev = prev.prev;
  }

  selector += `${element.name}:nth-of-type(${sameEleCount+1})`;

  return selector;
}

function getElementSelector(element: DomElement): string {

  if (element.name === 'html') {
    return 'html';
  } else if (element.name === 'head') {
    return 'html > head';
  } else if (element.name === 'body') {
    return 'html > body';
  }

  let selector = 'html > ';

  let parents = new Array<string>();
  let parent = element.parent;
  while (parent && parent.name !== 'html') {
    parents.unshift(getElementSelfLocationInParent(parent));
    parent = parent.parent;
  }
  
  selector += parents.join(' > ');
  selector += ' > ' + getElementSelfLocationInParent(element);

  return selector;
}

export {
  createAccessibleElement
};