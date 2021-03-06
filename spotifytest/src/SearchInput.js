import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ResultsDisplay from './ResultsDisplay'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default class SearchInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            query: '',
            token: localStorage.getItem('token'),
            search: [],
            SQ: [{ id: "Album", value: "album"},
                { id: "Artist", value: "artist"},
                { id: "Track", value: "track"} ,
                { id: "Playlist", value: "playlist"}],
            target:''
        };
        this.prepSearch = this.prepSearch.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.checkPlayer = this.checkPlayer.bind(this);
    }
    doSearch(text, array){
        this.setState({query: encodeURIComponent(text.trim())}, () => {
            fetch('https://api.spotify.com/v1/search?q=' + this.state.query + '&type=' + array.toString() + '&limit=5', 
                {headers:{'Authorization': 'Bearer ' + this.state.token}})
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    ReactDOM.render(<ResultsDisplay token={this.state.token} data={data}/>, document.getElementById("root"))
                })
            }
        )
    }
    prepSearch(e){
        let checkedCount = 0
        let typeArray = []
        if(e.key === 'Enter'){
            for (let i = 0; i < this.state.SQ.length; i++){
                if(document.getElementById(this.state.SQ[i].id).checked === true){
                    typeArray.push(this.state.SQ[i].value)
                    checkedCount++
                }
            }
            if((checkedCount !== 0) && (e.target.value !== ''))
                this.doSearch(e.target.value,typeArray)
            else ((e.target.value === '') 
            ? alert("Please enter a Spotify search query") 
            : alert("Please select what type of search to perform"))
        }
    }
    componentDidMount(){
        setInterval(this.checkPlayer,15000)
    }
    checkPlayer(){
        let iframePlayer = document.getElementById("spotifyPlayer").src
        console.log("Player => " + iframePlayer)
    }
    
    render(){
        const ListOptions = (
            this.state.SQ.map((object) => (
                <div key={object.id} className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id={object.id} value={object.value} defaultChecked={(object.id === "Album") ? true : false}/>
                    <label className="custom-control-label" htmlFor={object.id}>{object.id}</label>
                </div>
            )
        ));
        const InputField = (
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Search Spotify</span>
                </div>
                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" onKeyPress={this.prepSearch}/>
            </div>
        );
        const spotifyPlayer = (
            <div className="text-center m-3">
                    <iframe title="spotifyPlayer" id="spotifyPlayer" src={this.props.target} width="300" height="380" allowtransparency="true" allow="encrypted-media" ></iframe>
            </div>
        );

        return(
                <div>
                    <h2>Spotify WebApp</h2>
                    {InputField}
                    {ListOptions}
                    {spotifyPlayer}
                </div>
            );
    }
}
