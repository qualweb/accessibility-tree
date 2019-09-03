const { generateAccessibilityTree } = require('../dist/index');
const { getDom } = require('@qualweb/get-dom-puppeteer');
const { expect } = require('chai');

const URL = 'http://accessible-serv.lasige.di.fc.ul.pt/~jvicente/test/';

describe.only('Console log', function() {
  it('should print', async function() {
    this.timeout(10 * 1000);
    const { processed } = await getDom(URL, { generateIds: true });
    const AT = await generateAccessibilityTree(processed.html.parsed, { setReferences: true });
    console.log(JSON.stringify(AT, null, 2));
    expect(Object.keys(AT)).to.be.an('array').and.to.include('nElements');
  });
});

describe('Accessibility tree', function() {
  describe('"nElements" field', function() {
    it('should exist', async function() {
      this.timeout(10 * 1000);
      const { processed } = await getDom(URL);
      const AT = await generateAccessibilityTree(processed.html.parsed);
      expect(Object.keys(AT)).to.be.an('array').and.to.include('nElements');
    });
    it('should be of type "number"', async function() {
      this.timeout(10 * 1000);
      const { processed } = await getDom(URL);
      const AT = await generateAccessibilityTree(processed.html.parsed);
      expect(AT.nElements).to.be.a('number');
    });
    it('should not be 0', async function() {
      this.timeout(10 * 1000);
      const { processed } = await getDom(URL);
      const AT = await generateAccessibilityTree(processed.html.parsed, { setReferences: true });
      expect(AT.nElements).to.be.greaterThan(0);
    });
  });
  describe('"containsReferences" field', function() {
    it('should exist', async function() {
      this.timeout(10 * 1000);
      const { processed } = await getDom(URL);
      const AT = await generateAccessibilityTree(processed.html.parsed);
      expect(Object.keys(AT)).to.be.an('array').and.to.include('containsReferences');
    });
    it('should be of type "boolean"', async function() {
      this.timeout(10 * 1000);
      const { processed } = await getDom(URL);
      const AT = await generateAccessibilityTree(processed.html.parsed);
      expect(AT.containsReferences).to.be.a('boolean');
    });
    it('should be true', async function() {
      this.timeout(10 * 1000);
      const { processed } = await getDom(URL);
      const AT = await generateAccessibilityTree(processed.html.parsed, { setReferences: true });
      expect(AT.containsReferences).to.be.equal(true);
    });
    it('should be false', async function() {
      this.timeout(10 * 1000);
      const { processed } = await getDom(URL);
      const AT = await generateAccessibilityTree(processed.html.parsed);
      expect(AT.containsReferences).to.be.equal(false);
    });
  });
  describe('"tree" field', function() {
    it('should exist', async function() {
      this.timeout(10 * 1000);
      const { processed } = await getDom(URL);
      const AT = await generateAccessibilityTree(processed.html.parsed);
      expect(Object.keys(AT)).to.be.an('array').and.to.include('tree');
    });
  });
});