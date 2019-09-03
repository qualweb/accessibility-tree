# QualWeb accessibility tree implementation

## How to install

```shell
  $ npm i @qualweb/accessibility-tree --save
```

## How to run

### Additional packages

```shell
  $ npm i @qualweb/get-dom-puppeteer --save
```

```javascript
  'use strict';

  const { getDom } = require('@qualweb/get-dom-puppeteer');
  const { generateAccessibilityTree } = require('@qualweb/accessibility-tree');

  (async () => {
    const dom = await getDom('https://act-rules.github.io/pages/about/');

    const accessibilityTree = await generateAccessibilityTree(dom.processed.html.parsed);

    console.log(accessibilityTree);
  })();
```

# License

ISC