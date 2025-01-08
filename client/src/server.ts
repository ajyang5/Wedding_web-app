import { isRecord } from './record';
import { detail } from './detail';


/** Type of callback that accepts save notification for file with given name */
export type SaveCallback = (name: string, saved: boolean) => void;

/** Stores the contents of the given file on the server. */
/** 
 * Acccesses /save server endpoint, passing given "name" and guestInfo file 
 * "contents" in the BODY of the request. Recieves confirmation on completion.
 * Passes confirmation of save success to the given callback.
 * @param name of file to get contents of
 * @param guestInfo the guest info to be saved under the name
 * @param cb callback that accepts a file name and its contents.
 *           Called when server response is received and parsed.
 */
export const saveFile = (name: string, guestInfo: detail, cb: SaveCallback): void => {
  const body = {name: name, content: (guestInfo)};
  fetch("/api/save", {method: 'POST', body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'}})
    .then((res) => doSaveResp(name, res, cb))
    .catch(() => doSaveError("failed to connect to server"));
};


/** Type of callback that receives file contents (a detail object) and its name */
export type LoadCallback = (name: string, info: detail | null) => void;

/** 
 * Acccesses /load server endpoint, passing given "name" as a query param,
 * and recieves file contents for file name.
 * Passes file contents to the given callback.
 * @param name of file to get contents of
 * @param cb callback that accepts a file name and its contents.
 *           Called when server response is received and parsed.
 */
export const loadFile = (name: string, cb: LoadCallback): void => {
  fetch("/api/load?name=" + encodeURIComponent(name))
    .then((res) => doLoadResp(name, res, cb))
    .catch(() => doLoadError("failed to connect to server"));
}


/** Type of callback that accepts an array of all the file information */
export type CopyCallback = (files: Array<[string, detail]>) => void;

/** Stores the copy of the files in the server.
 * @param cb callback that accepts an array of files information.
 *           Called when server response is received and parsed.
 */
export const copyFile = (cb: CopyCallback): void => {
  fetch("/api/copyMap")
    .then((res) => doCopyResp(res, cb))
    .catch(() => doCopyError("failed to connect to server"));
};



///////////////////////////////////////////////////////////////////////////////
// Helper functions
///////////////////////////////////////////////////////////////////////////////

// Accessing /copyMap route helpers

// Called when the server responds to a request for the getting a copy of all the files.
const doCopyResp = (res: Response, cb: CopyCallback): void => {
  if (res.status === 200) {
    res.json().then((val) => doCopyJson(val, cb))
      .catch(() => doCopyError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(doCopyError)
      .catch(() => doCopyError("400 response is not text"));
  } else {
    doCopyError(`bad status code: ${res.status}`);
  }
};

// Called if an error occurs trying to receive a copy of the file
const doCopyError = (msg: string): void => {
  console.error(`Error fetching /api/copyMap: ${msg}`);
};

// Called when the copy file response JSON has been parsed.
const doCopyJson = (val: unknown, cb: CopyCallback): void => {
  if (!isRecord(val) || !Array.isArray(val.files)) {
    console.error('Invalid JSON from /api/copyMap', val);
    return;
  }

  const files: Array<[string, detail]> = [];
  for (const file of val.files) {
    if (typeof file[0] === 'string' && 
          (isRecord(file[1]) && typeof file[1].host ==="string"
                            && typeof file[1].isFamily==="boolean"
                            && typeof file[1].restriction ==="string"
                            && typeof file[1].numGuest ==="string"
                            && typeof file[1].additionalGuest ==="string"
                            && typeof file[1].additionalGuestRestriction ==="string")) {

      const info: detail = {host: file[1].host, isFamily: file[1].isFamily, 
                            restriction: file[1].restriction, numGuest: file[1].numGuest, 
                            additionalGuest: file[1].additionalGuest, 
                            additionalGuestRestriction: file[1].additionalGuestRestriction};
      files.push([file[0], info]);
    } else {
      console.error('Invalid files from /api/copyMap', val.files);
      return;
    }
  }
  cb(files);
};



// Accessing /save route helpers

// Called when the server responds to a request to save
const doSaveResp = (name: string, res: Response, cb: SaveCallback): void => {
  if (res.status === 200) {
    res.json().then((val) => doSaveJson(name, val, cb))
      .catch(() => doSaveError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(doSaveError)
      .catch(() => doSaveError("400 response is not text"));
  } else {
    doSaveError(`bad status code: ${res.status}`);
  }
};

// Called when the save response JSON has been parsed.
const doSaveJson = (name: string, val: unknown, cb: SaveCallback): void => {
  if (!isRecord(val) || typeof val.saved !== 'boolean') {
    console.error('Invalid JSON from /api/save', val);
    return;
  }

  cb(name, val.saved);
};

// Called if an error occurs trying to save the file
const doSaveError = (msg: string): void => {
  console.error(`Error fetching /api/save: ${msg}`);
};



// Accessing /load route helpers

// Called when the server responds to a request to load
const doLoadResp = (name: string, res: Response, cb: LoadCallback): void => {
  if (res.status === 200) {
    res.json().then((val) => doLoadJson(name, val, cb))
      .catch(() => doLoadError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(doLoadError)
      .catch(() => doLoadError("400 response is not text"));
  } else {
    doLoadError(`bad status code: ${res.status}`);
  }
};

// Called when the load response JSON has been parsed.
const doLoadJson = (name: string, val: unknown, cb: LoadCallback): void => {
  if (!isRecord(val) || typeof val.name !== 'string' ||
  val.content === undefined) {
    console.error('Invalid JSON from /api/load', val);
    return;
  }

  if (val.content === null) {
    cb(name, null);
  } else if (isRecord(val.content) && typeof val.content.host ==="string"
                                  && typeof val.content.isFamily==="boolean"
                                  && typeof val.content.restriction ==="string"
                                  && typeof val.content.numGuest ==="string"
                                  && typeof val.content.additionalGuest ==="string"
                                  && typeof val.content.additionalGuestRestriction ==="string") {

    const info: detail = {host: val.content.host, isFamily: val.content.isFamily, 
                          restriction: val.content.restriction, numGuest: val.content.numGuest, 
                          additionalGuest: val.content.additionalGuest, 
                          additionalGuestRestriction: val.content.additionalGuestRestriction};
    cb(name, info);
  } else {
    console.error('Invalid JSON from /api/load', val);
    return;
  }
};

// Called if an error occurs trying to looad the file
const doLoadError = (msg: string): void => {
  console.error(`Error fetching /api/load: ${msg}`);
};
