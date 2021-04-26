import React, {Component} from 'react';
import './Post.scss';

export default class Post extends Component {
    constructor(props) {
        super(props);
        console.log('post constructor');
    }

    render() {
        return (
            <article className="block post">
                {this.props.profile &&
                <header className="post__header">
                    <a href={"http://vk.com/" + this.props.profile.screen_name} className="post__author-avatar">
                        <img src={this.props.profile.photo_50} alt="post-author-avatar"/>
                    </a>
                    <div>
                        <a href={"http://vk.com/" + this.props.profile.screen_name} className="post__author-name">
                            {this.props.profile.first_name} {this.props.profile.last_name}
                        </a>
                        <span className="post__time">
                            {new Date(this.props.post.date * 1000).toLocaleString()}
                        </span>
                    </div>
                </header>
                }
                <div className="post__content">
                    <p>{this.props.post.text}</p>

                    {this.props.post.attachments &&
                    <div className="post__images">
                        {this.props.post.attachments
                            .filter(attachmentItem => attachmentItem.type === "photo")
                            .map(attachmentItem => <img src={attachmentItem.photo.sizes[2].url} alt=""/>)
                        }
                    </div>
                    }
                </div>
            </article>
        );
    }
}