import React, { Component, MouseEvent } from "react";
import { detail } from "./detail";

type WeddingMainProps = {
    guests: Array<[string, detail]>;
    onAdd: () => void;
    onOpen: (name: string) => void;
};

type WeddingMainState = {
    minJamesGuests: number;
    unknownJamesGuests: number;
    familyJames: number;
    minMollyGuests: number;
    unknownMollyGuests: number;
    familyMolly: number;
}

/** Displays the UI of the Wedding rvsp application's main page. */
export class WeddingMain extends Component<WeddingMainProps, WeddingMainState> {

    // intializes the states and constructs the object
    constructor(props: WeddingMainProps) {
        super(props);

        const [mollyMin, mollyUnknown, mollyFamily] : [number, number, number] = guestCount(
                                                                            "Molly", 0, 0, 0, 
                                                                            this.props.guests.length - 1,
                                                                            this.props.guests);

        const [jamesMin, jamesUnknown, jamesFamily] : [number, number, number] = guestCount(
                                                                            "James", 0, 0, 0, 
                                                                            this.props.guests.length - 1, 
                                                                            this.props.guests);

        this.state = {minJamesGuests: jamesMin, unknownJamesGuests: jamesUnknown, familyJames: jamesFamily,
                    minMollyGuests: mollyMin, unknownMollyGuests: mollyUnknown, familyMolly: mollyFamily};
    }

    // Shows contents on the screen.
    render = (): JSX.Element => {
        return <div>
        <h3>Guest List</h3>
        <ul>
            {this.renderGuestNames()}
        </ul>
        <p>Summary:</p>

        {this.renderMollyGuest()}
        {this.renderJamesGuest()}

        <button type="button" onClick={this.doAddClick}>Add Guest</button>
        </div>;
    };

    // Create a list of JSX.Element for displaying the guest list.
    renderGuestNames = (): JSX.Element[] => {
        const names: JSX.Element[] = [];
        for (const pair of this.props.guests) {
            const guest = pair[0];
            const info = pair[1];
            if (info !== undefined) {
                names.push(
                    <li key={guest}>
                        <a href="#" onClick={(evt) => this.doItemClick(evt, guest)}>{guest}</a> Guest
                        of {info.host} {info.numGuest===""?"+1?":"+"}{info.numGuest}
                    </li>);
            }
        }
        return names;
    };

    // Creates a JSX.Element object for displaying the Molly's guests information. 
    renderMollyGuest = (): JSX.Element => {
        if (this.state.unknownMollyGuests === 0) {
            return <div>
                <p>{this.state.minMollyGuests} guest{"("}s{")"} of Molly {"("}{this.state.familyMolly} family{")"}</p>
            </div>
        } else {
            return <div>
                <p>{this.state.minMollyGuests}-{this.state.minMollyGuests + this.state.unknownMollyGuests} guest
                {"("}s{")"} of Molly {"("}{this.state.familyMolly} family{")"}</p>
            </div>
        }
    };

    // Creates a JSX.Element object for displaying the James's guests information.
    renderJamesGuest = (): JSX.Element => {
        if (this.state.unknownJamesGuests === 0) {
            return <div>
                <p>{this.state.minJamesGuests} guest{"("}s{")"} of James {"("}{this.state.familyJames} family{")"}</p>
            </div>
        } else {
            return <div>
                <p>{this.state.minJamesGuests}-{this.state.minJamesGuests + this.state.unknownJamesGuests} 
                {" "} guest{"("}s{")"} of James {"("}{this.state.familyJames} family{")"}</p>
            </div>
        }
    };

    // Opens the guest detail page when the link for corresponding guest is clicked.
    doItemClick = (_evt: React.MouseEvent<HTMLAnchorElement>, name: string): void => {
        this.props.onOpen(name);
    }

    // Opens the add guest page when the add guest button is clicked.
    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onAdd();
    }
}

/** 
 * Converts a string to a color (or throws an exception if not a color). 
 * @param host name of the host
 * @param unknownCount Up to the index curr in the array guests, the number of guests that will bring
 *                     an unknown number of extra guest.
 * @param familyCount Up to the index curr in the array guests, the number of host's family in the guest list
 * @param minCount Up to the index curr in the array guests, the number of guests in the guests list
 * @param curr the current index, an integer that is >= -1
 * @param guests the guest list, an array containing all the (guest name, guest info) pairs
 * @returns [minimum guests for host, unknown guests for host, family guests for host]
 */
export const guestCount = (host: string, unknownCount: number, familyCount: number, minCount: number,
                           curr: number, guests: Array<[string, detail]>): [number, number, number] => {
    if (curr === -1) {
        return [minCount, unknownCount, familyCount];
    } else {
        const info: detail = guests[curr][1];
        if (info.host === host) {
            if (info.isFamily) {
                if (info.numGuest === "") {
                    return guestCount(host, unknownCount + 1, familyCount + 1, minCount + 1, curr - 1, guests);
                } else if (info.numGuest === "1") {
                    return guestCount(host, unknownCount, familyCount + 1, minCount + 2, curr - 1, guests);
                } else {
                    return guestCount(host, unknownCount, familyCount + 1, minCount + 1, curr - 1, guests);
                }
            } else {
                if (info.numGuest === "") {
                    return guestCount(host, unknownCount + 1, familyCount, minCount + 1, curr - 1, guests);
                } else if (info.numGuest === "1") {
                    return guestCount(host, unknownCount, familyCount, minCount + 2, curr - 1, guests);
                } else {
                    return guestCount(host, unknownCount, familyCount, minCount + 1, curr - 1, guests);
                }
            }
        } else {
            return guestCount(host, unknownCount, familyCount, minCount, curr - 1, guests);
        }
    }
}

