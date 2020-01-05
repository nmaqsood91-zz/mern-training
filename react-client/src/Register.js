import React, {useState, Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import Loader from './img/loader.gif'
import {register} from './redux/actions/auth'
class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            username: '',
            password: '',
            cPassword: ''
        }
    }
    handleInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.props.register({
            username: this.state.username,
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        })
    }

    render() {
        return (
            <section className="container">
                {this.props.auth.loading? <img src = {Loader} />: null}
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                    <div className="form-group">
                        <input type="text" placeholder="Name" name="name" required onChange = {this.handleInput} value = {this.state.name}/>
                    </div>
                    <div className="form-group">
                        <input type="text" placeholder="User Name" name="username" required onChange = {this.handleInput} value = {this.state.username}/>
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email Address" name="email" onChange = {this.handleInput} value = {this.state.email} />
                        <small className="form-text"
                        >This site uses Gravatar so if you want a profile image, use a
                            Gravatar email</small>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            minLength="6"
                            onChange = {this.handleInput} value = {this.state.password}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="cPassword"
                            minLength="6"
                            onChange = {this.handleInput} value = {this.state.cPassword}
                        />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register" onClick = {this.handleSubmit}/>
                <p className="my-1">
                    Already have an account? <Link to = "/login">Sign In</Link>
                </p>
            </section>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}
const actions = {
    register
}
export default connect(mapStateToProps, actions)(Register)