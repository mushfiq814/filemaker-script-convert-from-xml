# Extract FileMaker script steps into plain text
A NodeJS script to extract FileMaker scripts and convert them into plain text. 

## Purpose
FileMaker scripts are not able to be copied and pasted as plain text as they use a custom clipboard format `Max-XMSS` which is similar to XML. This script aims to extract the xml resulting in copying from a FileMaker script (perhaps using a plugin such as Base Elements) by parsing xml to json (using [`xml-js`](https://www.npmjs.com/package/xml-js)) and generating code.

## Sample File
There is a sample xml file at `./sample/script.xml`. To excute the script on the sample file, use the following npm script:
```sh
$ npm run sample
```

The xml will be converted to json at `./sample/script.json` and the final FileMaker script in plain text is at `./sample/script.fmp`
