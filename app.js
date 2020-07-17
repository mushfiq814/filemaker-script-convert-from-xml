const fs = require("fs");
const convert = require("xml-js");

// get FileMaker xml script
const xml = fs.readFileSync("./script.xml", { encoding: "utf-8" });

// convert xml to JSON
const resultStr = convert.xml2json(xml, { compact: false });
const result = JSON.parse(resultStr);
fs.writeFileSync("./script.json", resultStr);

// parse JSON tree and generate code
const codeGen = (tree) => {
  let code = "";
  let indent = 0;
  tree.forEach((el) => {
    // Handle Steps
    if (el.name == "Step") {
      const stepName = el.attributes.name;
      switch (stepName) {
        case "# (comment)": code = commentsGenCode(el); break;
        case "Set Field": code = setFieldGenCode(el); break;
        case "Set Variable": code = setVariableGenCode(el); break;
        case "Go to Layout": code = goToLayoutGenCode(el); break;
        case "If": code = singleCalcGenCode(el, stepName); break;
        case "Else If": code = singleCalcGenCode(el, stepName); break;
        case "Else": code = "Else"; break;
        case "End If": code = "End If"; break;
        case "Loop": code = "Loop"; break;
        case "Exit Loop If": code = singleCalcGenCode(el, stepName); break;
        case "End Loop": code = "End Loop"; break;
        case "Set Error Capture": code = setErrorCaptureGenCode(el); break;
        case "Halt Script": code = "Halt Script"; break;
        case "Exit Script": code = singleCalcGenCode(el, stepName); break;
        case "Go to Field": code = goToFieldGenCode(el); break;
        case "Go to Object": code = goToObjectGenCode(el); break;
        case "Go to Next Field": code = "Go to Next Field"; break;
        case "Go to Portal Row": code = goToPortalRowGenCode(el); break;
        case "New Record/Request": code = "New Record/Request"; break;
        case "Delete Record/Request": code = deleteRecordGenCode(el, stepName); break;
        case "Delete All Records": code = deleteRecordGenCode(el, stepName); break;
        case "Commit Records/Requests": code = commitRecordGenCode(el); break;
        case "Show All Records": code = "Show All Records"; break;
        case "Go to Previous Field": code = "Go to Previous Field"; break;
        case "Go to Record/Request/Page": code = goToRecordGenCode(el); break;
        case "Enter Find Mode": code = findModeGenCode(el, stepName); break;
        case "Perform Find": code = findModeGenCode(el, stepName); break;
        case "Perform Script": code = performScriptGenCode(el); break;
        case "Perform Script on Server": code = performScriptGenCode(el, true); break;
        case "Insert from URL": code = insertFromUrlGenCode(el); break;

        // CURRENTLY WORKING
        case "Show Custom Dialog": code = showCustomDialogGenCode(el); break;
        
        // LATER
        case "Go to Related Record": code = "Go to Related Record (WIP)"; break;
        case "Allow User Abort": code = "Allow User Abort (WIP)"; break;
        case "Install OnTimer Script": code = "Install OnTimer Script (WIP)"; break;
        case "Pause/Resume Script": code = "Pause/Resume Script (WIP)"; break;
        case "Set Error Logging": code = "Set Error Logging (WIP)"; break;
        case "Set Layout Object Animation": code = "Set Layout Object Animation (WIP)"; break;
        case "Configure Local Notification": code = "Configure Local Notification (WIP)"; break;
        case "Configure Region Monitor Script": code = "Configure Region Monitor Script (WIP)"; break;
        case "Close Popover": code = "Close Popover (WIP)"; break;
        case "Enter Browse Mode": code = "Enter Browse Mode (WIP)"; break;
        case "Enter Preview Mode": code = "Enter Preview Mode (WIP)"; break;
        case "Clear": code = "Clear (WIP)"; break;
        case "Copy": code = "Copy (WIP)"; break;
        case "Cut": code = "Cut (WIP)"; break;
        case "Paste": code = "Paste (WIP)"; break;
        case "Perform Find/Replace": code = "Perform Find/Replace (WIP)"; break;
        case "Select All": code = "Select All (WIP)"; break;
        case "Set Selection": code = "Set Selection (WIP)"; break;
        case "Undo/Redo": code = "Undo/Redo (WIP)"; break;
        case "Export Field Contents": code = "Export Field Contents (WIP)"; break;
        case "Insert Audio/Video": code = "Insert Audio/Video (WIP)"; break;
        case "Insert Calculated Result": code = "Insert Calculated Result (WIP)"; break;
        case "Insert Current Date": code = "Insert Current Date (WIP)"; break;
        case "Insert Current Time": code = "Insert Current Time (WIP)"; break;
        case "Insert Current User Name": code = "Insert Current User Name (WIP)"; break;
        case "Insert File": code = "Insert File (WIP)"; break;
        case "Insert from Device": code = "Insert from Device (WIP)"; break;
        case "Insert from Index": code = "Insert from Index (WIP)"; break;
        case "Insert from Last Visited": code = "Insert from Last Visited (WIP)"; break;
        case "Insert PDF": code = "Insert PDF (WIP)"; break;
        case "Insert Picture": code = "Insert Picture (WIP)"; break;
        case "Insert Text": code = "Insert Text (WIP)"; break;
        case "Relookup Field Contents": code = "Relookup Field Contents (WIP)"; break;
        case "Replace Field Contents": code = "Replace Field Contents (WIP)"; break;
        case "Set Field By Name": code = "Set Field By Name (WIP)"; break;
        case "Set Next Serial Value": code = "Set Next Serial Value (WIP)"; break;
        case "Copy All Records/Requests": code = "Copy All Records/Requests (WIP)"; break;
        case "Copy Record/Request": code = "Copy Record/Request (WIP)"; break;
        case "Delete Portal Row": code = "Delete Portal Row (WIP)"; break;
        case "Duplicate Record/Request": code = "Duplicate Record/Request (WIP)"; break;
        case "Export Records": code = "Export Records (WIP)"; break;
        case "Import Records": code = "Import Records (WIP)"; break;
        case "Open Record/Request": code = "Open Record/Request (WIP)"; break;
        case "Revert Record/Request": code = "Revert Record/Request (WIP)"; break;
        case "Save Records as Excel": code = "Save Records as Excel (WIP)"; break;
        case "Save Records as PDF": code = "Save Records as PDF (WIP)"; break;
        case "Save Records as Snapshot Link": code = "Save Records as Snapshot Link (WIP)"; break;
        case "Truncate Table": code = "Truncate Table (WIP)"; break;
        case "Constrain Found Set": code = "Constrain Found Set (WIP)"; break;
        case "Extend Found Set": code = "Extend Found Set (WIP)"; break;
        case "Find Matching Records": code = "Find Matching Records (WIP)"; break;
        case "Modify Last Find": code = "Modify Last Find (WIP)"; break;
        case "Omit Multiple Records": code = "Omit Multiple Records (WIP)"; break;
        case "Omit Record": code = "Omit Record (WIP)"; break;
        case "Perform Find": code = "Perform Find (WIP)"; break;
        case "Perform Quick Find": code = "Perform Quick Find (WIP)"; break;
        case "Show Omitted Only": code = "Show Omitted Only (WIP)"; break;
        case "Sort Records": code = "Sort Records (WIP)"; break;
        case "Sort Records by Field": code = "Sort Records by Field (WIP)"; break;
        case "Unsort Records": code = "Unsort Records (WIP)"; break;
        case "Adjust Window": code = "Adjust Window (WIP)"; break;
        case "Arrange All Windows": code = "Arrange All Windows (WIP)"; break;
        case "Close Window": code = "Close Window (WIP)"; break;
        case "Freeze Window": code = "Freeze Window (WIP)"; break;
        case "Move/Resize Window": code = "Move/Resize Window (WIP)"; break;
        case "New Window": code = "New Window (WIP)"; break;
        case "Refresh Window": code = "Refresh Window (WIP)"; break;
        case "Scroll Window": code = "Scroll Window (WIP)"; break;
        case "Select Window": code = "Select Window (WIP)"; break;
        case "Set Window Title": code = "Set Window Title (WIP)"; break;
        case "Set Zoom Level": code = "Set Zoom Level (WIP)"; break;
        case "Show/Hide Menubar": code = "Show/Hide Menubar (WIP)"; break;
        case "Show/Hide Text Ruler": code = "Show/Hide Text Ruler (WIP)"; break;
        case "Show/Hide Toolbars": code = "Show/Hide Toolbars (WIP)"; break;
        case "View As": code = "View As (WIP)"; break;
        case "Close Data File": code = "Close Data File (WIP)"; break;
        case "Close File": code = "Close File (WIP)"; break;
        case "Convert File": code = "Convert File (WIP)"; break;
        case "Create Data File": code = "Create Data File (WIP)"; break;
        case "Delete File": code = "Delete File (WIP)"; break;
        case "Get Data File Position": code = "Get Data File Position (WIP)"; break;
        case "Get File Exists": code = "Get File Exists (WIP)"; break;
        case "Get File Size": code = "Get File Size (WIP)"; break;
        case "New File": code = "New File (WIP)"; break;
        case "Open Data File": code = "Open Data File (WIP)"; break;
        case "Open File": code = "Open File (WIP)"; break;
        case "Print": code = "Print (WIP)"; break;
        case "Print Setup": code = "Print Setup (WIP)"; break;
        case "Read from Data File": code = "Read from Data File (WIP)"; break;
        case "Recover File": code = "Recover File (WIP)"; break;
        case "Rename File": code = "Rename File (WIP)"; break;
        case "Save a Copy as": code = "Save a Copy as (WIP)"; break;
        case "Save a Copy as XML": code = "Save a Copy as XML (WIP)"; break;
        case "Set Data File Position": code = "Set Data File Position (WIP)"; break;
        case "Set Multi-User": code = "Set Multi-User (WIP)"; break;
        case "Set Use System Formats": code = "Set Use System Formats (WIP)"; break;
        case "Write to Data File": code = "Write to Data File (WIP)"; break;
        case "Add Account": code = "Add Account (WIP)"; break;
        case "Change Password": code = "Change Password (WIP)"; break;
        case "Delete Account": code = "Delete Account (WIP)"; break;
        case "Enable Account": code = "Enable Account (WIP)"; break;
        case "Re-Login": code = "Re-Login (WIP)"; break;
        case "Reset Account Password": code = "Reset Account Password (WIP)"; break;
        case "Check Found Set": code = "Check Found Set (WIP)"; break;
        case "Check Record": code = "Check Record (WIP)"; break;
        case "Check Selection": code = "Check Selection (WIP)"; break;
        case "Correct Word": code = "Correct Word (WIP)"; break;
        case "Edit User Dictionary": code = "Edit User Dictionary (WIP)"; break;
        case "Select Dictionaries": code = "Select Dictionaries (WIP)"; break;
        case "Spelling Options": code = "Spelling Options (WIP)"; break;
        case "Open Edit Saved Finds": code = "Open Edit Saved Finds (WIP)"; break;
        case "Open Favorites": code = "Open Favorites (WIP)"; break;
        case "Open File Options ": code = "Open File Options  (WIP)"; break;
        case "Open Find/Replace ": code = "Open Find/Replace  (WIP)"; break;
        case "Open Help ": code = "Open Help  (WIP)"; break;
        case "Open Hosts ": code = "Open Hosts  (WIP)"; break;
        case "Open Manage Containers ": code = "Open Manage Containers  (WIP)"; break;
        case "Open Manage Data Sources ": code = "Open Manage Data Sources  (WIP)"; break;
        case "Open Manage Database ": code = "Open Manage Database  (WIP)"; break;
        case "Open Manage Layouts ": code = "Open Manage Layouts  (WIP)"; break;
        case "Open Manage Themes ": code = "Open Manage Themes  (WIP)"; break;
        case "Open Manage Value Lists ": code = "Open Manage Value Lists  (WIP)"; break;
        case "Open Preferences ": code = "Open Preferences  (WIP)"; break;
        case "Open Script Workspace ": code = "Open Script Workspace  (WIP)"; break;
        case "Open Sharing ": code = "Open Sharing  (WIP)"; break;
        case "Open Upload to Host": code = "Open Upload to Host (WIP)"; break;
        case "Allow Formatting Bar": code = "Allow Formatting Bar (WIP)"; break;
        case "AVPlayer Play": code = "AVPlayer Play (WIP)"; break;
        case "AVPlayer Set Options": code = "AVPlayer Set Options (WIP)"; break;
        case "AVPlayer Set Playback State": code = "AVPlayer Set Playback State (WIP)"; break;
        case "Beep Beep": code = "Beep Beep (WIP)"; break;
        case "Dial Phone": code = "Dial Phone (WIP)"; break;
        case "Enable Touch Keyboard": code = "Enable Touch Keyboard (WIP)"; break;
        case "Execute SQL": code = "Execute SQL (WIP)"; break;
        case "Exit Application": code = "Exit Application (WIP)"; break;
        case "Flush Cache to Disk": code = "Flush Cache to Disk (WIP)"; break;
        case "Get Folder Path": code = "Get Folder Path (WIP)"; break;
        case "Install Menu Set": code = "Install Menu Set (WIP)"; break;
        case "Install Plug-In File": code = "Install Plug-In File (WIP)"; break;
        case "Open URL": code = "Open URL (WIP)"; break;
        case "Perform AppleScript": code = "Perform AppleScript (WIP)"; break;
        case "Refresh Object": code = "Refresh Object (WIP)"; break;
        case "Refresh Portal": code = "Refresh Portal (WIP)"; break;
        case "Send DDE Execute": code = "Send DDE Execute (WIP)"; break;
        case "Send Event": code = "Send Event (WIP)"; break;
        case "Send Mail": code = "Send Mail (WIP)"; break;
        case "Set Web Viewer": code = "Set Web Viewer (WIP)"; break;
        case "Speak": code = "Speak (WIP)"; break;
        default: code = "Step Not Defined"; break;
      }
      // handle commented out code
      if (el.attributes.enable === "False") code = "// " + code;
      
      // handle indents
      if (stepName === "Else If"
       || stepName === "Else"
       || stepName === "End If"
       || stepName === "End Loop") indent--;

      // output
      for (let i=0; i<indent; i++) code = "  " + code;
      console.log(code);

      // handle future indents
      if (stepName === "If"
       || stepName === "Else If"
       || stepName === "Else"
       || stepName === "Loop") indent++;
    }
    
    // recursion
    if (el.elements) codeGen(el.elements);
  });
};

/**************************** HELPER functions ****************************/

/**
 * Filter element block by specific name and return it
 * or return whole array if single is false
 */
const getBlockWithName = (el, blockName, single=true) => {
  if (el.elements) {
    const blocks = el.elements.filter(inner => inner.name === blockName);
    if (blocks.length > 0) return single ? blocks[0] : blocks;
    else return undefined;
  }
  else throw new Error(`No elements in ${el.name}`);
}

// Handle and return Calculations
const getCalculatedResult = (el) => {
  const isCalc = el.elements[0].type === "cdata";
  if (!isCalc) throw new Error("Invalid Calculation");
  return el.elements[0].cdata;
}

// Handle NoInteract Block (With dialog:On/Off)
const noInteractBlock = (el) => {
  let noInteract = "undefined";
  try {
    noInteract = getBlockWithName(el, "NoInteract").attributes.state;
  } catch (e) {console.error(e);}
  return noInteract == "True" ? "Off" : "On";
}

// return state with On or Off
const getOnOffState = (el, blockName, boolReturn=false) => {
  let state = "undefined";
  try {
    state = getBlockWithName(el, blockName).attributes.state;
  } catch (e) {console.error(e);}
  if (boolReturn) return state == "True";
  else return state == "True" ? "On" : "Off";
}

// get the location code for Go To Portal Row/Record
const getRowPageLocation = (el) => {
  let location = "undefined";
  try {
    location = getBlockWithName(el, "RowPageLocation").attributes.value;
  } catch (e) {console.error(e);}
  if (location === "Previous" || location === "Next") {
    location += `; Exit after last:${getOnOffState(el, "Exit")}`;
  }
  else if (location === "ByCalculation") {
    let calc = "undefined";
    try {
      try {
        calc = getCalculatedResult(getBlockWithName(el, "Calculation"));
      } catch (e) {console.error(e);}
    } catch (e) {console.error(e)};
    location = `With dialog:${noInteractBlock(el)}; ${calc}`;
  }
  return location;
}

/**************************** CODE GEN functions ****************************/

// # This is a comment
const commentsGenCode = (el) => {
  return el.elements ? "# " + el.elements[0].elements[0].text : "";
}

// Set Field [table::field; $variable]
const setFieldGenCode = (el) => {
  let fieldInfo = "undefined";
  try {
    fieldInfo = getBlockWithName(el, "Field").attributes;
  } catch (e) {console.error(e);}
  const field = fieldInfo.table + "::" + fieldInfo.name;
  
  let calc = "undefined";
  try {
    try {
      calc = getCalculatedResult(getBlockWithName(el, "Calculation"));
    } catch (e) {console.error(e);}
  } catch (e) {console.error(e)};
  
  return `Set Field [${field}; ${calc}]`;
}

// Set Variable [$variable; Value: CALC]
const setVariableGenCode = (el) => {
  let varName = "undefined";
  try {
    varName = getBlockWithName(el, "Name").elements[0].text;
  } catch (e) {console.error(e);}
  
  let calc = "undefined";
  try {
    try {
      calc = getCalculatedResult(getBlockWithName(el, "Value").elements[0]);
    } catch (e) {console.error(e);}
  } catch (e) {console.error(e)};
  
  return `Set Variable [${varName}; Value: ${calc}]`;
}

// Go to Layout [layout|OriginalLayout|Calculation; Animation:None...]
const goToLayoutGenCode = (el) => {
  let layout = "";
  let layoutType = "undefined";
  try {
    layoutType = getBlockWithName(el, "LayoutDestination").attributes.value;
  } catch (e) {console.error(e);}
  if (layoutType === "OriginalLayout") layout = "original layout";
  else {
    let layoutBlock = "undefined";
    try {
      layoutBlock = getBlockWithName(el, "Layout");
    } catch (e) {console.error(e);}
    if (layoutType === "SelectedLayout") layout = layoutBlock.attributes.name;
    else if (layoutType === "LayoutNameByCalc" || layoutType === "LayoutNumberByCalc") {
      try {
        layout = getCalculatedResult(layoutBlock.elements[0]);
      } catch (e) {console.error(e)};
    }    
  }

  const animList = {
    "SlideFromLeft": "Slide in from Left",
    "SlideFromRight": "Slide in from Right",
    "SlideFromBottom": "Slide in from Bottom",
    "SlideToLeft": "Slide out to Left",
    "SlideToRight": "Slide out to Right",
    "SlideToBottom": "Slide out to Bottom",
    "FlipFromLeft": "Flip from Left",
    "FlipFromRight": "Flip from Right",
    "ZoomIn": "Zoom In",
    "ZoomOut": "Zoom Out",
    "CrossDissolve": "Cross Dissolve",
  }
  const animationBLock = el.elements.filter(inner => inner.name === "Animation");
  const hasAnimation = animationBLock.length > 0;
  const animation = hasAnimation ? animationBLock[0].attributes.value : "None";

  return `Go to Layout [${layout}; Animation:${animList[animation]}]`;
}

// For steps that have only calculated result as the parameter
const singleCalcGenCode = (el, keyWord) => {
  let calc = "undefined";
  if (!el.elements) return `${keyWord}`;
  try {calc = getCalculatedResult(el.elements[0]);} catch (e) {console.error(`${e}; Error at singleCalcGenCode(${el.name},${keyWord})`)};
  return `${keyWord} [${calc}]`;
}

// Set Error Capture [On/Off]
const setErrorCaptureGenCode = (el) => {
  return `Set Error Capture [${getOnOffState(el, "Set")}]`;
}

// Go to Field [table::field]
const goToFieldGenCode = (el) => {
  let fieldInfo = "undefined";
  try {
    fieldInfo = getBlockWithName(el, "Field").attributes;
  } catch (e) {console.error(e);}
  const field = fieldInfo.table + "::" + fieldInfo.name;
  return `Go to Field [${field}]`;
}

// Go to Object [Object Name: ""]
const goToObjectGenCode = (el) => {
  let obj = "undefined";
  try {
    try {
      obj = getCalculatedResult(getBlockWithName(el, "ObjectName").elements[0]);
    } catch (e) {console.error(e);}
  } catch (e) {console.error(e)};
  return `Go to Object [Object Name:${obj}]`
}

// Go to Portal Row [Select:On/Off; First...]
const goToPortalRowGenCode = (el) => {
  return `Go to Portal Row [Select:${getOnOffState(el, "SelectAll")}; ${getRowPageLocation(el)}]`;
}

// Go to Record/Request/Page []
const goToRecordGenCode = (el) => {
  return `Go to Record/Request/Page [${getRowPageLocation(el)}]`;
}

// Delete Record/Request [With dialog:On/Off]
const deleteRecordGenCode = (el, keyWord) => {
  return `${keyWord} [With dialog:${noInteractBlock(el)}]`;
}

// Commit Records/Requests [Skip data entry validation; With dialog:On/Off; Force Commit]
const commitRecordGenCode = (el) => {
  let skipEntry = "undefined";
  try {
    skipEntry = getBlockWithName(el, "Option").attributes.state;
  } catch (e) {console.error(e);}
  let out = skipEntry == "True" ? "Skip data entry validation; " : "";
  
  out += "With dialog:" + (noInteractBlock(el));

  let forceCommit = "undefined";
  try {
    forceCommit = getBlockWithName(el, "ESSForceCommit").attributes.state;
  } catch (e) {console.error(e);}
  out += forceCommit == "True" ? "; Force Commit" : "";
  return `Commit Records/Requests [${out}]`;
}

// Enter Find Mode/Perform Find
const findModeGenCode = (el, keyWord) => {
  const restore = getOnOffState(el, "Restore");
  let findReq = "";
  if (restore === "On") {
    let queries = "undefined";
    try {
      queries = getBlockWithName(el, "Query");
    } catch (e) {console.error(e);}
    let criterion = [], fieldInfo = {}, field = "", value = "";
    let queryArr = [];
    // go through each query
    queries.elements.forEach(query => {
      include = query.attributes.operation === "Include" ? "Find Records" : "Omit Records";
      
      // go through each criteria of query
      let criteriaArr = [];
      try {
        criterion = getBlockWithName(query, "Criteria", false);
      } catch (e) {console.error(e);}
      criterion.forEach(criteria => {
        try {
          fieldInfo = getBlockWithName(criteria, "Field").attributes;
        } catch (e) {console.error(e);}
        field = fieldInfo.table + "::" + fieldInfo.name;
        try {
          value = getBlockWithName(criteria, "Text").elements[0].text;
        } catch (e) {console.error(e);}
        criteriaArr.push(`${field}=${value}`);
      });
      queryArr.push(`${include}: ${JSON.stringify(criteriaArr)}`);
    })
    findReq = `Restore: {${JSON.stringify(queryArr)}}; `;
  };
  const out = findReq + (keyWord === "Enter Find Mode" ? "Pause:" + getOnOffState(el, "Pause") : "");
  return `${keyWord} [${out}]`;
}

// Perform Script [on Server]
const performScriptGenCode = (el, onServer=false) => {
  let out = "", label = "", param = "";
  if (el.elements) {
    const fromScriptList = el.elements.filter((inner) => inner.name === "Script");
    const fromCalc = el.elements.filter((inner) => inner.name === "Calculated");
    const paramBlock = el.elements.filter((inner) => inner.name === "Calculation");
    
    if (fromScriptList.length > 0) {
      out = "From list";
      label = `"${fromScriptList[0].attributes.name}"`;
    } else if (fromCalc.length > 0) {
      out = "By name";
      label = getCalculatedResult(fromCalc[0].elements[0]);
    } 
    if (paramBlock.length > 0) {
      param = getCalculatedResult(paramBlock[0]);
    }
  } else {
    out = "From list";
    label = "<unknown>";
  }
  
  // Script on Server specific code
  let scriptName = 'Perform Script '
  scriptName += onServer ? 'on Server' : '';
  const waitForCompletion = onServer ? getOnOffState(el, 'WaitForCompletion') : false;
  const serverSuffix = onServer ? `; Wait for completion: ${waitForCompletion}`: '';
  return `${scriptName} [Specified:${out}; ${label}; Parameter:${param}${serverSuffix}]`;
}

// Show Custom Dialog
const showCustomDialogGenCode = (el) => {
  let title = '', desc = '', buttons = [];
  if (el.elements) {
    const titleBlock = el.elements.filter(inner => inner.name === 'Title');
    if (titleBlock.length > 0) title = getCalculatedResult(titleBlock[0].elements[0]);

    const descBlock = el.elements.filter(inner => inner.name === 'Message');
    if (descBlock.length > 0) desc = getCalculatedResult(descBlock[0].elements[0]);
    
    const buttonsBlock = el.elements.filter(inner => inner.name === 'Buttons');
    if (buttonsBlock.length > 0 && buttonsBlock[0].elements) {
      const buttonBlocks = buttonsBlock[0].elements.filter(inner => inner.name === 'Button');
      let btnText = '', btnCommitState = false;
      buttonBlocks.forEach(button => {
        btnText = '', btnCommitState = false;
        if (button.elements) {
          btnText = getCalculatedResult(button.elements[0]);
          btnCommitState = button.attributes.CommitState == "True";
        }
        if (btnText.length > 0) buttons.push(`${btnText}${btnCommitState ? '; commit' : ''}`);
      })
    }
  }

  let out = '';
  if (buttons.length > 0) {
    out = `; buttons: {${buttons.map(btn => `[${btn}]`).join('; ')}}`
  }

  return `Show Custom Dialog [${title}; ${desc}${out}]`;

}

// Insert from URL
const insertFromUrlGenCode = (el) => {
  let out = '';
  const select = getOnOffState(el, "SelectAll", true);
  out = select ? 'Select; ' : '';
  const noInteract = noInteractBlock(el);
  out += `With dialog:${noInteract}`;
  const hasFieldOrVar = getBlockWithName(el, 'Field', false) != undefined;
  if (hasFieldOrVar) {
    const hasField = getBlockWithName(el, "Field").attributes;
    const hasVariable = getBlockWithName(el, "Field").elements;
    let target = '';
    if (hasField) target = hasField.table + "::" + hasField.name;
    else if (hasVariable) target = hasVariable[0].text;
    out += `; Target:${target}`
  }
  const hasUrl = getBlockWithName(el, 'Calculation', false) != undefined;
  if (hasUrl) out += `; ${getCalculatedResult(getBlockWithName(el, 'Calculation'))}`;

  const verifySSL = getOnOffState(el, 'VerifySSLCertificates', true);
  out += verifySSL ? '; Verify SSL Certificates' : '';
  const dontEncodeUrl = getOnOffState(el, 'DontEncodeURL', true);
  out += dontEncodeUrl ? '; Do not automatically encode URL' : '';

  const hasCurlOpt = getBlockWithName(el, 'CURLOptions', false) != undefined;
  if (hasCurlOpt) {
    curlBlock = getBlockWithName(el, 'CURLOptions');
    out += `; cURL options:${getCalculatedResult(curlBlock.elements[0])}`;
  }
  return `Insert from URL [${out}]`;
}

codeGen(result.elements);