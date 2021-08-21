import React, { Component } from 'react';

export default class Filters extends Component {
    constructor(props) {
        super(props);

        this.handleGroupLinkBlur = this.handleGroupLinkBlur.bind(this);
        this.handleGroupLinkChange = this.handleGroupLinkChange.bind(this);
        this.handleWithPhotoOnlyFilterChange = this.handleWithPhotoOnlyFilterChange.bind(this);
    }

    handleGroupLinkBlur(e) {
        this.props.onGroupLinkBlur(e.target.value);
    }

    handleGroupLinkChange(e) {
        this.props.onGroupLinkChange(e.target.value);
    }

    handleWithPhotoOnlyFilterChange(e) {
        const checked = e.target.checked;
        this.props.onChange("withPhotoOnly", checked);
    }

    render() {
        let groupLinkFieldClasses = [
            "form-control",
            this.props.error ? "border-danger" : ""
        ];
        return (
            <div className="block filters">
                <div className="form-group">
                    <label htmlFor="group-link">Группа</label>
                    <input type="text"
                           autoFocus={true}
                           className={groupLinkFieldClasses.filter(item => item !== "").join(" ")}
                           placeholder="Укажите url группы"
                           value={this.props.groupLink}
                           onBlur={this.handleGroupLinkBlur}
                           onChange={this.handleGroupLinkChange}/>
                    {this.props.error &&
                    <small className="form-text text-danger">Введите правильный url группы</small>}
                </div>

                <hr/>

                <div className="form-check">
                    <input type="checkbox"
                           className="form-check-input"
                           id="with-photo"
                           checked={this.props.filters.withPhotoOnly.active}
                           onChange={this.handleWithPhotoOnlyFilterChange}
                    />
                    <label htmlFor="with-photo" className="form-check-label">только с фотографиями</label>
                </div>
            </div>
        );
    }
}
