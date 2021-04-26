import React, {Component} from 'react';
import './GroupInfo.scss';

export default class GroupInfo extends Component {
    render() {
        return (
            <div className="block group">
                <img src={this.props.image} alt="" className="group__logo mb-3"/>
                <div className="group__title">{this.props.name}</div>
            </div>
        );
    }
}
