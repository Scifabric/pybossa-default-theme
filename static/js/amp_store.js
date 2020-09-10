const privateData = ["L1", "L2"];
const publicData = ["L3", "L4"];
const pvfgig200 = "GIG 200";

window.onload = function(){
  let optin = document.getElementById("amp_store");
  let ampPvf = document.getElementById("amp_pvf");
  const dataAccess = getDataAccess();

  if (optin && optin.checked === false){
    ampPvf.removeAttribute('readonly');
    optin.removeAttribute('onclick');
  }
  if (optin && optin.checked && publicData.includes(dataAccess)){
      // set default amp pvf to GIG 200
      ampPvf.value = pvfgig200;
      ampPvf.setAttribute('readonly', true);
  }
}

function getDataAccess(){
  let inputDataClass = "";
  let outputDataClass = "";

  const inputData = document.getElementById("input_data_class");
  if (inputData !== null){
    inputDataClass = inputData.value.substr(0,2);
  }

  const outputData = document.getElementById("output_data_class");
  if (outputData !== null){
    outputDataClass = outputData.value.substr(0,2);
  }

  if (inputDataClass !== "" && outputDataClass !== ""){
    return [inputDataClass, outputDataClass].sort()[0];
  } else {
    return "";
  }
}

function onOptinClicked(){
  // for public data, set pvf to GIG 200
  // otherwise, reset pvf for user to enter value
  const dataAccess = getDataAccess();
  const ampStore = document.getElementById("amp_store");
  const ampPvf = document.getElementById("amp_pvf");

  if (ampStore === null || ampPvf === null){
    return;
  }

  const optin = ampStore.checked;
  if (optin && publicData.includes(dataAccess)){
      ampPvf.value = pvfgig200;
      ampPvf.setAttribute('readonly', true);
  } else {
    ampPvf.removeAttribute('readonly');
    ampPvf.value = "";
  }
}


function handleAmpStoreProps() {
  const dataAccess = getDataAccess()
  if (dataAccess === ""){
      return;
  }

  const ampStore = document.getElementById("amp_store");
  const ampPvf = document.getElementById("amp_pvf");
  if (ampStore === null || ampPvf === null){
    return;
  }

  // set opt-in default value
  if (dataAccess === "L1"){
    ampStore.checked = false;
  } else {
    ampStore.checked = true;
  }

  if (publicData.includes(dataAccess)){
      // set default amp pvf to GIG 200
      ampPvf.value = pvfgig200;
      ampPvf.setAttribute('readonly', true);
  } else if (privateData.includes(dataAccess)){
      // enable setting optin and amp pvf
      ampPvf.removeAttribute('readonly');
      if (ampPvf.value === pvfgig200){
          ampPvf.value = "";
      }
  }
}    
