# Extract FileMaker script steps into plain text
A NodeJS script to extract FileMaker scripts and convert them into plain text. 

## Purpose
FileMaker scripts are not able to be copied and pasted as plain text as they use a custom clipboard format `Max-XMSS` which is similar to XML. This script aims to extract the xml resulting in copying from a FileMaker script (perhaps using a plugin such as Base Elements) by parsing xml to json (using [`xml-js`](https://www.npmjs.com/package/xml-js)) and generating code.
