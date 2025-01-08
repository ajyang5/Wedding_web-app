import React, { Component, ChangeEvent, MouseEvent } from "react";
import { detail } from "./detail";

type WeddingAddGuestState = {
    name: string;
    guestOf: string;
    isFamily: boolean;
    error: string;
}

type WeddingAddGuestProps = {
    guestName: string;
    guestInfo: detail;
    onBack: () => void;
    onSave: (name: string, info: detail) => void;
  };
  
  /** Displays the UI of the Wedding rsvp application's add guest page. */
  export class WeddingAddGuest extends Component<WeddingAddGuestProps, WeddingAddGuestState> {
  
    // intializes the states and constructs the object
    constructor(props: WeddingAddGuestProps) {
      super(props);
  
      this.state = {name: this.props.guestName, guestOf: this.props.guestInfo.host, 
                    isFamily: this.props.guestInfo.isFamily, error:""};
    }
    
    // Shows contents on the screen.
    render = (): JSX.Element => {
      return <div>
        <h3>Add Guest</h3>
        <div>
          <label htmlFor="name">Name:{" "}</label>
          <input type="text" id="name" value={this.state.name}
                  onChange={this.doNameChange}/><br></br><br></br>
        </div>
  
        <div>
          <label htmlFor="guestOf">Guest Of:</label><br></br>
          <input type="radio" id="molly" name="guestOf" value="Molly" onChange={this.doHostChange} checked={this.state.guestOf === 'Molly'}/>
          <label htmlFor="molly">Molly</label><br></br>
          <input type="radio" id="james" name="guestOf" value="James" onChange={this.doHostChange} checked={this.state.guestOf === 'James'}/>
          <label htmlFor="james">James</label><br></br><br></br>
        </div>
        
        <div>
          <input type="checkbox" id="family" checked={this.state.isFamily}
          onChange={this.doFamilyChange}/>
          <label htmlFor="family">Family</label><br></br><br></br>
        </div>
  
        <button type="button" onClick={this.doAddClick}>Add</button>
        <button type="button" onClick={this.doBackClick}>Back</button>
        <div>{this.state.error}</div>
      </div>;
    };
  
    // Updates the guest's name based on the input
    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
      this.setState({name: evt.target.value});
    }
  
    // Saves the guest's information when the add button is clicked
    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.name.trim() === "") {
            this.setState({error: "Error: Guest name is required."});
        } else if (this.state.guestOf === "") {
            this.setState({error: "Error: Host is required."});
        } else {
            this.setState({error: ""});
            const info: detail = {host: this.state.guestOf, 
                                isFamily: this.state.isFamily, 
                                restriction: "", 
                                numGuest: "", 
                                additionalGuest: "", 
                                additionalGuestRestriction: ""};

            this.props.onSave(this.state.name, info);
        }
    }
  
    // Goes back to the main page when the back button is clicked
    doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBack();
    }
  
    // Updates wether the guest is a family member or not based on the input
    doFamilyChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
      this.setState({isFamily: !this.state.isFamily});
    }

    // Updates the guest's host based on the input
    doHostChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({guestOf: evt.target.value});
    }

}