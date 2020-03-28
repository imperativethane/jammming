import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: ''
        }
        this.search = this.search.bind(this);
        this.handleSearchTerm = this.handleSearchTerm.bind(this);
    }

    search() {
        this.props.onSearch(this.state.searchTerm)
    }

    handleSearchTerm(e) {
        this.setState({
            searchTerm: e.target.value
        })
    }
    
    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleSearchTerm} />
                <button className="SearchButton">SEARCH</button>
            </div>
        )
    }
}
