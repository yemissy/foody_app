import React, { Component } from 'react';
import axios from 'axios';
import LoggedInView from './components/LoggedIn/LoggedInView';
import Login from './components/LoggedOut/Login';
import CreateAccount from './components/LoggedOut/CreateAccount';
import Welcome from './components/Welcome';
// import AllRecipes from './components/LoggedIn/AllRecipes';
// import Recipe from './components/Recipe';
import './App.css';

const BASE_URL = 'http://localhost:3001';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      favorites: [
        {
          id: 3,
          url: 'youtube.com/fav1',
          title: 'veg fav',
          category: 'Vegetarian',
        },
        {
          id: 2,
          url: 'youtube.com/fav2',
          title: 'vegan fav',
          category: 'Vegan',
        },
      ],
      favoritesView: false,
      selected: '',
      filterResults: [],
      view: '',
      newUser: {

      },
    };
    this.renderFavorites = this.renderFavorites.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.setView = this.setView.bind(this);
    this.postNew = this.postNew.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    await this.getRecipes();
  }

  async getRecipes() {
    const results = await axios.get(`${BASE_URL}/recipes`);
    const recipes = results.data;
    // console.log(recipes);
    this.setState({ recipes });
  }

  setView(view) {
    this.setState({ view });
  }

  getView() {
    const { view } = this.state;
    switch (view) {
      case 'login':
        return <Login />;
      case 'signup':
        return (
          // put new user inside of state
          <CreateAccount onSubmit={this.postNew} onChange={this.onChange}/>
        );
      case 'loggedin':
        return (
          <LoggedInView
            className="recipeframe"
            handleSelect={this.handleSelect}
            renderFavorites={this.renderFavorites}
            favoritesView={this.state.favoritesView}
            recipes={this.state.recipes}
            selected={this.state.selected}
            favorites={this.state.favorites}
          />
        );
      default:
        return <Welcome pageSwitch={this.setView} />;
    }
  }


  handleSelect(filter) {
    this.setState({
      selected: filter,
    });
  }

  onChange(e) {
    const changed = e.target.id;
    const info = e.target.value;
    console.log(changed);
    console.log(info);
    this.setState(prevState => ({
      newUser: {
        ...prevState.newUser, [changed]: info
      }
    }))
  }

  postNew(e) {
    e.preventDefault();
    this.saveUser(this.state.newUser);
  }

  async saveUser(user) {
    try {
      axios.post('http://localhost:3001/users/', user);
    } catch (e) { console.error(e); } finally { 
      this.setState({
        view: 'loggedin',
        newUser: { name: '', password: '' },
      });
    }
  }

  renderFavorites(nextView) {
    this.setState({
      favoritesView: nextView,
    });
  }

  render() {
    return (
      <div className="App">
        {this.getView()}
      </div>
    );
  }
}

export default App;
