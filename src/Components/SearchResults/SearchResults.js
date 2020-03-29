import React from 'react';
import './SearchResults.css';
import { TrackList } from '../TrackList/TrackList'

export class SearchResults extends React.Component {
    renderAction() {
        if(this.props.isRecommendation) {
            return <h2>Recommendations</h2>
        } else {
            return <h2>Results</h2>
        }
    }
    
    render() {
        return(
            <div className="SearchResults">
                {this.renderAction()}
                <TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false}/>
            </div>
        )
    }
}