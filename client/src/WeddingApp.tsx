import React, { Component} from "react";
import { WeddingDetails } from './WeddingDetails';
import { WeddingAddGuest } from './WeddingAddGuest';
import { WeddingMain } from './WeddingMain';
import { saveFile, loadFile, copyFile } from "./server";
import { detail } from "./detail";


type Page = {kind: "Main", files: Array<[string, detail]>} 
          | {kind: "Details", guest: string, guestInfo: detail} 
          | {kind: "AddGuest", guest: string, guestInfo: detail}; 


type WeddingAppState = {
  show: Page;   // Stores state for the current page of the app to show
  loading: boolean;
}

const blankInfo: detail = {host: "", 
                          isFamily: false, 
                          restriction: "", 
                          numGuest: "", 
                          additionalGuest: "", 
                          additionalGuestRestriction: ""}

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {

  // intializes the states and constructs the object
  constructor(props: {}) {
    super(props);
    this.state = {show: {kind: "Main", files: []}, loading: true};
  }

  // Updates all the information in the begining
  componentDidMount = (): void => {
    this.doBackClick();
  };
 
  // Shows contents on the screen.
  render = (): JSX.Element => {
    if (this.state.loading === true) {
      return <p>Loading...</p>;
    } else if (this.state.show.kind === "Details") {
      return <WeddingDetails name={this.state.show.guest} 
                              guestInfo={this.state.show.guestInfo}
                              onBack={this.doBackClick}
                              onSave={this.doSave2Click}/>
    } else if (this.state.show.kind === "AddGuest") {
      return <WeddingAddGuest guestName={this.state.show.guest}
                              guestInfo={this.state.show.guestInfo}
                              onBack={this.doBackClick}
                              onSave={this.doSaveClick}/>
    } else {
        return <WeddingMain guests={this.state.show.files} 
                            onAdd={this.doOpenAddClick} onOpen={this.doOpenDetailsClick}/>
    }
  };

  // Goes back to the main page when the back button is clicked
  doBackClick= (): void => {
    this.setState({loading: true});
    copyFile(this.doCopyResp)
  }

  // Called when the copy file response is received; 
  // Opens the main page based on the new copy of files received
  doCopyResp = (files: Array<[string, detail]>): void => {
    this.setState({show: {kind: "Main", files: files}, loading: false});
  }

  // Saves the guest information under their name
  doSaveClick= (name: string, info: detail): void => {
    this.setState({loading: true});
    saveFile(name, info, this.doSave1Resp);
  }

  // Called when the save file response is received; 
  // Notifies the user if the saving is failed; goes back to the main page
  doSave1Resp = (name: string, saved: boolean): void => {
    if (saved === false) {
      alert("The file called " + name + " is not saved successfully!");
    }
    this.doBackClick();
  };

  // Opens the add guest page when button is clicked
  doOpenAddClick= (): void => {
    this.setState({show: {kind: "AddGuest", guest: "", guestInfo: blankInfo}});
  }

  // Saves the guest information under their name
  doSave2Click= (name: string, info: detail): void => {
    this.setState({loading: true});
    saveFile(name, info, this.doSave2Resp);
  }

  // Called when the save file response is received; 
  // Notifies the user if the saving is failed
  doSave2Resp = (name: string, saved: boolean): void => {
    if (saved === false) {
      alert("The file called " + name + " is not saved successfully!");
    }
    loadFile(name, this.doLoad2Resp);
  };

  // Called when the load file response is received; 
  // Updates the information on the page
  doLoad2Resp = (name: string, guestInfo: detail | null): void => {
    this.setState({loading: false});
    if (guestInfo === null) {
      alert("No guest info associated with this name!");
    } else {
      this.setState({show: {kind: "Details", guest: name, guestInfo: guestInfo}});
    }
  }

  // Opens the guest details page when the button is clicked
  doOpenDetailsClick= (name: string): void => {
    this.setState({loading: true});
    loadFile(name, this.doLoad2Resp);
  }
}