import React, { Component } from 'react';

export default class Filters extends Component {
    constructor(props) {
        super(props);

        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleBlur(e) {
        this.props.onGroupLinkBlur(e.target.value);
    }

    handleChange(e) {
        this.props.onGroupLinkChange(e.target.value);
    }

    render() {
        let groupLinkFieldClasses = [
            "form-control",
            this.props.error ? "border-danger" : ""
        ];
        return (
            <div className="block filters">
                <div class="form-group">
                    <label htmlFor="group-link">Группа</label>
                    <input type="email"
                           className={groupLinkFieldClasses.filter(item => item !== "").join(" ")}
                           placeholder="Укажите url группы"
                           value={this.props.groupLink} onBlur={this.handleBlur} onChange={this.handleChange}/>
                    {this.props.error &&
                    <small className="form-text text-danger">Введите правильный url группы</small>}
                </div>
            </div>
        );
    }
}
