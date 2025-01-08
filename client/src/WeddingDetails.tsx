import React, { Component, ChangeEvent, MouseEvent } from "react";
import { detail } from "./detail";

type WeddingDetailsProps = {
    guestInfo: detail;
    name: string;
    onBack: () => void;
    onSave: (name: string, info: detail) => void;
};

type WeddingDetailsState = {
    restriction: string;
    numAdditionalGuest: string;
    guestName: string;
    guestRestriction: string;
    error: string;
}


/** Displays the UI of the Wedding rsvp application's guest detail pages. */
export class WeddingDetails extends Component<WeddingDetailsProps, WeddingDetailsState> {
  
  // intializes the states and constructs the object
  constructor(props: WeddingDetailsProps) {
    super(props);
  
    this.state = {restriction: this.props.guestInfo.restriction, 
                  numAdditionalGuest: this.props.guestInfo.numGuest, 
                  guestName: this.props.guestInfo.additionalGuest, 
                  guestRestriction: this.props.guestInfo.additionalGuestRestriction, 
                  error: ""};
  }
  
  // Shows contents on the screen.
  render = (): JSX.Element => {
    return <div>
      <h3>Guest Details</h3>
      <p>{this.props.name}, guest of {this.props.guestInfo.host}{this.props.guestInfo.isFamily ? ", family": ""}</p>
      <div>
        <label htmlFor="restriction">Dietary Restrictions {"("}'none' if none{")"}:</label><br></br>
        <input type="text" id="restriction" value={this.state.restriction}
                onChange={this.doRestrictionChange}/><br></br><br></br>
      </div>

      <div>
        <label htmlFor="guest">Additional Guest?</label><br></br>        
        <select id="guest" value={this.state.numAdditionalGuest} onChange={this.doGuestChange}>
          <option value = "">Unkown</option>
          <option value = "0">0</option>
          <option value = "1">1</option>
      </select>
      </div>

      {this.renderAdditionalGuest()}

      <button type="button" onClick={this.doSaveClick}>Save</button>
      <button type="button" onClick={this.doBackClick}>Back</button>
      <div>{this.state.error}</div>
    </div>;
  };

  // Updates the guest's dietary restriction based on the input
  doRestrictionChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({restriction: evt.target.value});
  }

  // Updates the additional guest's dietary restriction based on the input
  doGuestRestrictionChange = (evt: ChangeEvent<HTMLInputElement>): void => {
      this.setState({guestRestriction: evt.target.value});
    }

  // Updates the error message if any information is missing when the save button is clicked.
  // Otherwise, updates the guest's information based on the input
  doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
      if (this.state.restriction.trim() === "") {
          this.setState({error: "Error: Must specify any dietary restrictions or 'none'."});
      } else if (this.state.numAdditionalGuest === "") {
          this.setState({error: "Error: Must specify any additional guest."});
      } else if (this.state.numAdditionalGuest === "1" && this.state.guestName.trim() === "") {
              this.setState({error: "Error: Must specify name of additional guest."});
      } else if (this.state.numAdditionalGuest === "1" && this.state.guestRestriction.trim() === "") {
              this.setState({error: "Error: Must specify any dietary restrictions of additional guest or 'none'."});
      } else {
          this.setState({error: ""});
          const info: detail = {host: this.props.guestInfo.host, 
                              isFamily: this.props.guestInfo.isFamily, 
                              restriction: this.state.restriction, 
                              numGuest: this.state.numAdditionalGuest, 
                              additionalGuest: this.state.guestName, 
                              additionalGuestRestriction: this.state.guestRestriction};

          this.props.onSave(this.props.name, info);
      }
  }

  // Goes back to the main page when the back button is clicked
  doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
      this.props.onBack();    
  }

  // Updates the number of additional guest based on the input
  doGuestChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
      this.setState({numAdditionalGuest: evt.target.value});
  }

  // Updates the number of additional guest's name based on the input
  doGuestNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
      this.setState({guestName: evt.target.value});
  }

  // Shows up form for inputting the additional guest's information on the screen if there is any
  renderAdditionalGuest = (): JSX.Element => {
      if (this.state.numAdditionalGuest === "1") {
          return <div>
              <label htmlFor="name">Guest Name:{" "}</label>
              <input type="text" id="name" value={this.state.guestName}
                      onChange={this.doGuestNameChange}/><br></br><br></br>

              <label htmlFor="guestRestriction">Guest Dietary Restrictions {"("}'none' if none{")"}:</label><br></br>
              <input type="text" id="guestRestriction" value={this.state.guestRestriction}
                      onChange={this.doGuestRestrictionChange}/><br></br><br></br>
          </div>
      } else {
          return <div></div>
      }
  }
}