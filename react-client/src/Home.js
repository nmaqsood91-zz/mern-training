import React from 'react'
import Nav from './Nav'
import Landing from './Landing'
import Register from './Register'
import Login from './Login'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
const Home = (props) => {
    return (
        <div>
            <Router>
                <Switch>
                    <Route path = "/register" component = {Register}></Route>
                    <Route path = "/login" component = {Login}></Route>
                </Switch>
            </Router>
            <Nav/>
            <Landing/>
        </div>
    )
}
export default Home