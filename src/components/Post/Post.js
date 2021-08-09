import React, {Component} from 'react';
import './Post.scss';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import linkIcon from '../../icons/foreign.svg';

export default class Post extends Component {
    componentDidMount() {
        if (this.postPhotos.length) {
            new Viewer(document.querySelector(`#post-${this.props.post.id} .post__images`), {
                url: "data-origin",
                toolbar: {
                    prev: {
                        show: true,
                        size: "large",
                    },
                    next: {
                        show: true,
                        size: "large",
                    }
                },
                navbar: false,
            });
        }
    }

    static getThumbnail(sizes, {width, height}) {
        for (let size of sizes) {
            if ((width && size.width > width) || (height && size.height > height)) {
                return size.url;
            }
        }

        return null;
    }

    static getOriginalImage(sizes) {
        return sizes.length > 0 ? sizes[sizes.length - 1].url : null;
    }

    render() {
        this.postPhotos = this.props.post.attachments ?
            this.props.post.attachments.filter(attachmentItem => attachmentItem.type === "photo")
            : [];

        return (
            <article id={"post-" + this.props.post.id} className="block post">
                {this.props.profile &&
                <header className="post__header">
                    <a href={"https://vk.com/" + this.props.profile.screen_name} className="post__author-avatar" target={"blank"}>
                        <img src={this.props.profile.photo_50} alt="post-author-avatar"/>
                    </a>
                    <div>
                        <a href={"https://vk.com/" + this.props.profile.screen_name} className="post__author-name" target={"blank"}>
                            {this.props.profile.first_name} {this.props.profile.last_name}
                        </a>
                        <span className="post__time">
                            {new Date(this.props.post.date * 1000).toLocaleString()}
                        </span>
                    </div>
                    <a href={`https://vk.com/wall${this.props.post.owner_id}_${this.props.post.id}`} className="post__link" target="blank">
                        <img src={linkIcon} alt="" className="post__link-icon"/>
                    </a>
                </header>
                }
                <div className="post__content">
                    <p>{this.props.post.text}</p>

                    {this.postPhotos.length !== 0 &&
                    <div className="post__images">
                        {this.postPhotos.map(
                            attachmentItem =>
                                <img src={Post.getThumbnail(attachmentItem.photo.sizes, {width: 150})} alt=""
                                     data-origin={Post.getOriginalImage(attachmentItem.photo.sizes)} className="post__image"/>
                                )
                        }
                    </div>
                    }
                </div>
            </article>
        );
    }
}